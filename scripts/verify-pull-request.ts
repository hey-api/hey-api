const CERTIFICATION_MARKER = /hey-api:certification/;
const CHECKBOX = /^\s*-\s*\[([ xX])\]/;

// Accepted issue reference forms:
//   #123                                       same-repo shorthand
//   owner/repo#123                             cross-repo shorthand
//   https://github.com/owner/repo/issues/123   full URL
const ISSUE_REFERENCE =
  /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+|(?:[\w.-]+\/[\w.-]+)?#\d+/;

function stripHtmlComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function certificationError(body: string): string | null {
  const line = body.split('\n').find((candidate) => CERTIFICATION_MARKER.test(candidate));

  if (line === undefined) {
    return 'Certification statement is missing. It must not be removed. Restore the certification checkbox from the pull request template and check it.';
  }

  const match = line.match(CHECKBOX);
  if (match === null) {
    return 'Certification line was found but is no longer a valid checkbox. Restore the original line from the pull request template.';
  }

  if (match[1]?.toLowerCase() !== 'x') {
    return 'Certification checkbox is present but unchecked. Check it only once you have reviewed and verified the code in this pull request.';
  }

  return null;
}

function linkedIssueError(body: string): string | null {
  if (!ISSUE_REFERENCE.test(stripHtmlComments(body))) {
    return 'No linked issue found. Reference at least one issue this pull request closes or relates to, using #123, owner/repo#123, or the full issue URL.';
  }

  return null;
}

function validate(body: string): Array<string> {
  return [certificationError(body), linkedIssueError(body)].filter(
    (error): error is string => error !== null,
  );
}

const COMMENT_MARKER = '<!-- hey-api:pr-check -->';
const API = 'https://api.github.com';

interface IssueComment {
  body?: string;
  id: number;
}

function headers(token: string): Record<string, string> {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
    'user-agent': 'hey-api-pr-check',
    'x-github-api-version': '2022-11-28',
  };
}

async function request(url: string, token: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, { ...init, headers: headers(token) });
  if (!response.ok) {
    throw new Error(`${init.method ?? 'GET'} ${url} -> ${response.status}`);
  }
  return response;
}

function renderComment(errors: Array<string>): string {
  return [
    COMMENT_MARKER,
    '### Pull request checklist',
    '',
    'A few things need attention before this pull request can be merged:',
    '',
    ...errors.map((error) => `- ${error}`),
    '',
    'Update the description and this check re-runs automatically.',
  ].join('\n');
}

async function syncComment(errors: Array<string>): Promise<void> {
  const token = process.env.GH_TOKEN;
  const repo = process.env.GH_REPOSITORY ?? process.env.GITHUB_REPOSITORY;
  const prNumber = process.env.PR_NUMBER;

  if (!token || !repo || !prNumber) {
    return;
  }

  try {
    const list = await request(
      `${API}/repos/${repo}/issues/${prNumber}/comments?per_page=100`,
      token,
    );
    const comments = (await list.json()) as Array<IssueComment>;
    const existing = comments.find((comment) => comment.body?.includes(COMMENT_MARKER));

    if (errors.length > 0) {
      const body = JSON.stringify({ body: renderComment(errors) });
      if (existing) {
        await request(`${API}/repos/${repo}/issues/comments/${existing.id}`, token, {
          body,
          method: 'PATCH',
        });
      } else {
        await request(`${API}/repos/${repo}/issues/${prNumber}/comments`, token, {
          body,
          method: 'POST',
        });
      }
    } else if (existing) {
      await request(`${API}/repos/${repo}/issues/comments/${existing.id}`, token, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.log(`::warning::Could not sync pull request comment: ${String(error)}`);
  }
}

async function main(): Promise<void> {
  const errors = validate(process.env.PR_BODY ?? '');

  for (const error of errors) {
    console.log(`::error::${error}`);
  }

  await syncComment(errors);

  if (errors.length > 0) {
    process.exit(1);
  }

  console.log('Pull request description looks good: certified and linked to an issue.');
}

void main();
