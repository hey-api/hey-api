import colors from 'ansi-colors';

type PerformanceMarkResult = ReturnType<typeof performance.mark>;
type PerformanceMeasureResult = ReturnType<typeof performance.measure>;

interface LoggerEvent {
  end?: PerformanceMarkResult;
  events: Array<LoggerEvent>;
  id: string; // unique internal key
  name: string;
  start: PerformanceMarkResult;
}

interface Severity {
  color: colors.StyleFunction;
  type: 'duration' | 'percentage';
}

interface StoredEventResult {
  position: ReadonlyArray<number>;
}

let loggerCounter = 0;
const nameToId = (name: string) => `${name}-${loggerCounter++}`;
const idEnd = (id: string) => `${id}-end`;
const idLength = (id: string) => `${id}-length`;
const idStart = (id: string) => `${id}-start`;

const getSeverity = (duration: number, percentage: number): Severity | undefined => {
  if (duration > 200) {
    return {
      color: colors.red,
      type: 'duration',
    };
  }
  if (percentage > 30) {
    return {
      color: colors.red,
      type: 'percentage',
    };
  }
  if (duration > 50) {
    return {
      color: colors.yellow,
      type: 'duration',
    };
  }
  if (percentage > 10) {
    return {
      color: colors.yellow,
      type: 'percentage',
    };
  }
  return;
};

export class Logger {
  private events: Array<LoggerEvent> = [];

  private end(result: StoredEventResult): void {
    let event: LoggerEvent | undefined;
    let events = this.events;
    for (const index of result.position) {
      event = events[index];
      if (event?.events) {
        events = event.events;
      }
    }
    if (event && !event.end) {
      event.end = performance.mark(idEnd(event.id));
    }
  }

  /**
   * Recursively end all unended events in the event tree.
   * This ensures all events have end marks before measuring.
   */
  private endAllEvents(events: Array<LoggerEvent>): void {
    for (const event of events) {
      if (!event.end) {
        event.end = performance.mark(idEnd(event.id));
      }
      if (event.events.length) {
        this.endAllEvents(event.events);
      }
    }
  }

  report(print: boolean = true): PerformanceMeasureResult | undefined {
    const firstEvent = this.events[0];
    if (!firstEvent) return;

    // Ensure all events are ended before reporting
    this.endAllEvents(this.events);

    const lastEvent = this.events[this.events.length - 1]!;
    const name = 'root';
    const id = nameToId(name);

    try {
      const measure = performance.measure(
        idLength(id),
        idStart(firstEvent.id),
        idEnd(lastEvent.id),
      );
      if (print) {
        this.reportEvent({
          end: lastEvent.end,
          events: this.events,
          id,
          indent: 0,
          measure,
          name,
          start: firstEvent!.start,
        });
      }
      return measure;
    } catch {
      // If measuring fails (e.g., marks don't exist), silently skip reporting
      // to avoid crashing the application
      return;
    }
  }

  private reportEvent({
    indent,
    ...parent
  }: LoggerEvent & {
    indent: number;
    measure: PerformanceMeasureResult;
  }): void {
    const color = !indent ? colors.cyan : colors.gray;
    const lastIndex = parent.events.length - 1;

    parent.events.forEach((event, index) => {
      try {
        const measure = performance.measure(idLength(event.id), idStart(event.id), idEnd(event.id));
        const duration = Math.ceil(measure.duration * 100) / 100;
        const percentage =
          Math.ceil((measure.duration / parent.measure.duration) * 100 * 100) / 100;
        const severity = indent ? getSeverity(duration, percentage) : undefined;

        let durationLabel = `${duration.toFixed(2).padStart(8)}ms`;
        if (severity?.type === 'duration') {
          durationLabel = severity.color(durationLabel);
        }

        const branch = index === lastIndex ? '└─ ' : '├─ ';
        const prefix = !indent ? '' : '│  '.repeat(indent - 1) + branch;
        const maxLength = 38 - prefix.length;

        const percentageBranch = !indent ? '' : '↳ ';
        const percentagePrefix = indent ? ' '.repeat(indent - 1) + percentageBranch : '';
        let percentageLabel = `${percentagePrefix}${percentage.toFixed(2)}%`;
        if (severity?.type === 'percentage') {
          percentageLabel = severity.color(percentageLabel);
        }
        const jobPrefix = colors.gray('[root] ');
        console.log(
          `${jobPrefix}${colors.gray(prefix)}${color(
            `${event.name.padEnd(maxLength)} ${durationLabel} (${percentageLabel})`,
          )}`,
        );
        this.reportEvent({ ...event, indent: indent + 1, measure });
      } catch {
        // If measuring fails (e.g., marks don't exist), silently skip this event
        // to avoid crashing the application
      }
    });
  }

  private start(id: string): PerformanceMarkResult {
    return performance.mark(idStart(id));
  }

  private storeEvent({
    result,
    ...event
  }: Pick<LoggerEvent, 'events' | 'id' | 'name' | 'start'> & {
    result: StoredEventResult;
  }): void {
    const lastEventIndex = event.events.length - 1;
    const lastEvent = event.events[lastEventIndex];
    if (lastEvent && !lastEvent.end) {
      result.position = [...result.position, lastEventIndex];
      this.storeEvent({ ...event, events: lastEvent.events, result });
      return;
    }
    const length = event.events.push({ ...event, events: [] });
    result.position = [...result.position, length - 1];
  }

  timeEvent(name: string) {
    const id = nameToId(name);
    const start = this.start(id);
    const event: LoggerEvent = {
      events: this.events,
      id,
      name,
      start,
    };
    const result: StoredEventResult = {
      position: [],
    };
    this.storeEvent({ ...event, result });
    return {
      mark: start,
      timeEnd: () => this.end(result),
    };
  }
}
