import fs from 'node:fs';
import path from 'node:path';

const TEMPLATES_DIR = path.join(import.meta.dirname, 'templates');
const PACKAGES_DIR = path.join(import.meta.dirname, '..', 'packages');
const TEMPLATE_MARKER_REGEX = /<!-- template-([a-z0-9-]+)-(start|end) -->/g;

interface MarkerEvent {
  index: number;
  length: number;
  name: string;
  type: 'end' | 'start';
}

function getMarkerEvents(content: string): Array<MarkerEvent> {
  const events: Array<MarkerEvent> = [];

  for (const match of content.matchAll(TEMPLATE_MARKER_REGEX)) {
    const index = match.index;
    if (index === undefined) continue;

    events.push({
      index,
      length: match[0].length,
      name: match[1]!,
      type: match[2] as MarkerEvent['type'],
    });
  }

  return events;
}

function getMarkerLineRange(
  content: string,
  event: MarkerEvent,
): {
  end: number;
  start: number;
} {
  const lastNewlineIndex = content.lastIndexOf('\n', event.index - 1);
  const start = lastNewlineIndex === -1 ? 0 : lastNewlineIndex + 1;
  const nextNewlineIndex = content.indexOf('\n', event.index + event.length);
  const end = nextNewlineIndex === -1 ? content.length : nextNewlineIndex + 1;

  return { end, start };
}

function stripMarkerLines(content: string, shouldStrip: (event: MarkerEvent) => boolean): string {
  const ranges = getMarkerEvents(content)
    .filter(shouldStrip)
    .map((event) => getMarkerLineRange(content, event))
    .sort((a, b) => b.start - a.start);

  let output = content;

  for (const range of ranges) {
    output = output.slice(0, range.start) + output.slice(range.end);
  }

  return output;
}

function findTemplateMarkers(content: string): Array<string> {
  const markers = new Set<string>();

  for (const event of getMarkerEvents(content)) {
    if (event.type === 'start') {
      markers.add(event.name);
    }
  }

  return Array.from(markers);
}

function stripTemplateMarkers(content: string): string {
  return stripMarkerLines(content, () => true);
}

function stripSpecificTemplateMarkers(content: string, markerNames: Set<string>): string {
  if (!markerNames.size) return content;
  return stripMarkerLines(content, (event) => markerNames.has(event.name));
}

function getReadmeMarkerGroups(content: string): {
  nestedMarkers: Set<string>;
  rootMarkers: Array<string>;
} {
  const nestedMarkers = new Set<string>();
  const rootMarkers: Array<string> = [];
  const rootMarkerNames = new Set<string>();
  const openStack: Array<string> = [];

  for (const event of getMarkerEvents(content)) {
    const { name, type } = event;

    if (type === 'start') {
      if (openStack.length) {
        nestedMarkers.add(name);
      }
      openStack.push(name);
      continue;
    }

    if (!openStack.length) {
      continue;
    }

    const lastOpenName = openStack[openStack.length - 1];
    if (lastOpenName !== name) {
      continue;
    }

    const depth = openStack.length;
    openStack.pop();

    if (depth === 1 && !rootMarkerNames.has(name)) {
      rootMarkerNames.add(name);
      rootMarkers.push(name);
    }
  }

  return { nestedMarkers, rootMarkers };
}

function readTemplateRaw(name: string, cache: Map<string, string>): string | undefined {
  const cached = cache.get(name);

  if (cached !== undefined) {
    return cached;
  }

  const templatePath = path.join(TEMPLATES_DIR, `${name}.md`);

  try {
    const template = fs.readFileSync(templatePath, 'utf-8');
    cache.set(name, template);
    return template;
  } catch {
    return;
  }
}

function resolveTemplate(
  name: string,
  rawTemplateCache: Map<string, string>,
  resolvedTemplateCache: Map<string, string>,
  resolvingTemplates: Set<string>,
): string | undefined {
  const resolved = resolvedTemplateCache.get(name);
  if (resolved) return resolved;

  if (resolvingTemplates.has(name)) return;

  const rawTemplate = readTemplateRaw(name, rawTemplateCache);
  if (!rawTemplate) return;

  resolvingTemplates.add(name);

  let resolvedTemplate = rawTemplate;
  const nestedMarkers = findTemplateMarkers(rawTemplate);

  for (const nestedName of nestedMarkers) {
    const nestedTemplate = resolveTemplate(
      nestedName,
      rawTemplateCache,
      resolvedTemplateCache,
      resolvingTemplates,
    );

    if (!nestedTemplate) continue;

    resolvedTemplate = replaceMarkersContent(resolvedTemplate, nestedTemplate, nestedName);
  }

  resolvingTemplates.delete(name);
  resolvedTemplateCache.set(name, resolvedTemplate);

  return resolvedTemplate;
}

function syncTemplates(
  rawTemplateCache: Map<string, string>,
  resolvedTemplateCache: Map<string, string>,
): void {
  const templateEntries = fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => ({
      name: path.parse(entry.name).name,
      templatePath: path.join(TEMPLATES_DIR, entry.name),
    }));

  for (const { name, templatePath } of templateEntries) {
    const rawTemplate = readTemplateRaw(name, rawTemplateCache);
    const resolvedTemplate = resolveTemplate(
      name,
      rawTemplateCache,
      resolvedTemplateCache,
      new Set<string>(),
    );

    if (!rawTemplate || !resolvedTemplate || rawTemplate === resolvedTemplate) {
      continue;
    }

    fs.writeFileSync(templatePath, resolvedTemplate);
    rawTemplateCache.set(name, resolvedTemplate);
    resolvedTemplateCache.set(name, resolvedTemplate);
  }
}

function findFirstMarkerPair(
  content: string,
  templateName: string,
):
  | {
      endIndex: number;
      startContentIndex: number;
    }
  | undefined {
  const openStack: Array<MarkerEvent> = [];

  for (const event of getMarkerEvents(content)) {
    if (event.type === 'start') {
      openStack.push(event);
      continue;
    }

    if (!openStack.length) {
      continue;
    }

    const lastOpenEvent = openStack[openStack.length - 1];
    if (lastOpenEvent?.name !== event.name) {
      continue;
    }

    const matchedStartEvent = openStack.pop();
    if (!matchedStartEvent || matchedStartEvent.name !== templateName) {
      continue;
    }

    return {
      endIndex: event.index,
      startContentIndex: matchedStartEvent.index + matchedStartEvent.length,
    };
  }
}

function replaceMarkersContent(source: string, template: string, templateName: string): string {
  const pair = findFirstMarkerPair(source, templateName);
  if (!pair) return source;

  return (
    source.slice(0, pair.startContentIndex) + `\n${template.trim()}\n` + source.slice(pair.endIndex)
  );
}

function readmeSync(): void {
  const rawTemplateCache = new Map<string, string>();
  const resolvedTemplateCache = new Map<string, string>();
  syncTemplates(rawTemplateCache, resolvedTemplateCache);
  const packages = fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const readmePaths = [
    path.join(import.meta.dirname, '..', 'README.md'),
    ...packages.map((pkg) => path.join(PACKAGES_DIR, pkg, 'README.md')),
  ];

  let updated = 0;

  for (const readmePath of readmePaths) {
    let content: string;
    try {
      content = fs.readFileSync(readmePath, 'utf-8');
    } catch {
      continue;
    }

    let updatedContent = content;
    const { nestedMarkers, rootMarkers } = getReadmeMarkerGroups(content);

    for (const name of rootMarkers) {
      const templateContent = resolveTemplate(
        name,
        rawTemplateCache,
        resolvedTemplateCache,
        new Set<string>(),
      );
      if (!templateContent) {
        continue;
      }

      updatedContent = replaceMarkersContent(
        updatedContent,
        stripTemplateMarkers(templateContent),
        name,
      );
    }

    updatedContent = stripSpecificTemplateMarkers(updatedContent, nestedMarkers);

    if (updatedContent !== content) {
      fs.writeFileSync(readmePath, updatedContent);
      updated++;
    }
  }

  console.log(`✓ Synced ${updated} README file${updated !== 1 ? 's' : ''}`);
}

readmeSync();
