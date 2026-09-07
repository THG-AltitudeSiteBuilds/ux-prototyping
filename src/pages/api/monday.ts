import type { APIRoute } from 'astro';

export const prerender = false;

/* ---------------------------------------------------------------------------
   Server side of the Team Dashboard (/team-dashboard).

   The page has no data of its own. It calls here, and this reads the squad's
   Monday boards with a token that never reaches the browser.

     MONDAY_API_TOKEN — Monday v2 GraphQL. Read-only use.

   Locally that lives in .dev.vars (gitignored). On the deployed site it is set
   as an Altitude platform variable, which arrives as a build-time .env — see
   findToken() for how the three delivery mechanisms are handled.

   Deliberately NOT a passthrough, and read-only. The client names an operation,
   never a query: raw GraphQL is not accepted, only the squad boards can be read,
   and there is no write path — the dashboard never edits a board, so a mutation
   endpoint would be attack surface that nothing uses.
--------------------------------------------------------------------------- */

const MONDAY_API = 'https://api.monday.com/v2';

/** The squad's boards. Anything else is refused. */
const BOARDS: Record<string, string> = {
  '5089014716': 'Nutrition Projects',
  '5089014754': 'Nutrition Tech Tickets',
  '5102000247': 'UX Experiment Results',
  '5102647068': 'Squad PM — Open Questions',
};

const ITEM_LIMIT = 500;

type Env = Record<string, string | undefined>;

/**
 * Finds the Monday token wherever this platform happens to put it, and says
 * which mechanism supplied it.
 *
 * Three are in play and they are not interchangeable:
 *   - Cloudflare runtime bindings   -> locals.runtime.env  (wrangler dev, .dev.vars)
 *   - Altitude platform variables   -> a .env written at the project root at
 *                                      build time, which Vite inlines
 *   - A plain shell environment     -> process.env         (nodejs_compat)
 *
 * import.meta.env must be read by direct property access. Spreading it does not
 * reliably carry non-PUBLIC_ variables through the Vite build, which would leave
 * the token silently undefined on a deploy that had actually been configured
 * correctly — the most confusing possible failure.
 */
function findToken(locals: unknown): { value?: string; source: string } {
  const runtime = (locals as { runtime?: { env?: Env } } | undefined)?.runtime?.env;
  if (runtime?.MONDAY_API_TOKEN) return { value: runtime.MONDAY_API_TOKEN, source: 'runtime binding' };

  if (import.meta.env.MONDAY_API_TOKEN) {
    return { value: String(import.meta.env.MONDAY_API_TOKEN), source: 'build-time .env' };
  }

  const shell = typeof process !== 'undefined' ? process.env?.MONDAY_API_TOKEN : undefined;
  if (shell) return { value: shell, source: 'process.env' };

  return { source: 'not set' };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const fail = (message: string, status = 400) => json({ error: message }, status);

/* ---------------------------------------------------------------- Monday --- */

async function monday(token: string, query: string, variables: Record<string, unknown>) {
  const res = await fetch(MONDAY_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: token,
      'API-Version': '2024-10',
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Monday returned a non-JSON response (HTTP ${res.status})`);
  }

  if (!res.ok) throw new Error(`Monday HTTP ${res.status}: ${text.slice(0, 300)}`);
  if (payload.errors?.length) throw new Error(payload.errors.map((e: any) => e.message).join('; '));
  if (payload.error_message) throw new Error(String(payload.error_message));
  return payload.data;
}

const ITEM_FIELDS = `
  id
  name
  url
  updated_at
  group { title }
`;

/**
 * Returns one object per item, with column_values flattened to
 * { columnId: displayText }. The dashboard reads every column as a plain
 * string, so `text` is the right field for all of them — dates come back as
 * YYYY-MM-DD, timelines as "from - to", people and dropdowns as comma-separated
 * lists.
 */
async function readBoard(token: string, args: any) {
  const boardId = String(args?.boardId ?? '');
  if (!BOARDS[boardId]) throw new Error(`Board ${boardId || '(none)'} is not one of the squad boards`);

  const limit = Math.min(Number(args?.limit) || 100, ITEM_LIMIT);
  const columnIds: string[] | null =
    Array.isArray(args?.columnIds) && args.columnIds.length ? args.columnIds.map(String) : null;

  // Two shapes rather than passing ids:null — an explicit null on the `ids`
  // argument is not the same as omitting it, and returns nothing.
  const cols = columnIds ? `column_values(ids:$cols){ id text }` : `column_values{ id text }`;
  const colArg = columnIds ? ',$cols:[String!]' : '';

  const firstPage = `query($ids:[ID!],$limit:Int!${colArg}){
    boards(ids:$ids){ items_page(limit:$limit){ cursor items{ ${ITEM_FIELDS} ${cols} } } } }`;
  const nextPage = `query($cursor:String!,$limit:Int!${colArg}){
    next_items_page(cursor:$cursor,limit:$limit){ cursor items{ ${ITEM_FIELDS} ${cols} } } }`;

  // items_page caps each response at its own page size, so a board with more
  // rows than the page holds comes back silently short. Follow the cursor until
  // we have what was asked for — a truncated ticket list would understate
  // engineering load without saying so.
  const raw: any[] = [];
  let cursor: string | null = null;
  const base: Record<string, unknown> = columnIds ? { cols: columnIds } : {};

  do {
    const data: any = cursor
      ? await monday(token, nextPage, { ...base, cursor, limit })
      : await monday(token, firstPage, { ...base, ids: [boardId], limit });
    const page = cursor ? data?.next_items_page : data?.boards?.[0]?.items_page;
    const chunk = page?.items ?? [];
    raw.push(...chunk);
    cursor = chunk.length && raw.length < limit ? (page?.cursor ?? null) : null;
  } while (cursor);

  const items = raw.slice(0, limit).map((it: any) => {
    const column_values: Record<string, string> = {};
    for (const c of it.column_values ?? []) column_values[c.id] = c.text ?? '';
    return {
      id: String(it.id),
      name: it.name ?? '',
      url: it.url ?? '',
      updated_at: it.updated_at ?? '',
      group: { title: it.group?.title ?? '' },
      column_values,
    };
  });

  return { items };
}

/* ------------------------------------------------------------------ route --- */

export const POST: APIRoute = async ({ request, locals }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return fail('Expected a JSON body');
  }

  const op = String(body?.op ?? '');
  if (op !== 'items') return fail(`Unknown operation "${op}"`);

  const { value: token } = findToken(locals);
  if (!token) return fail('MONDAY_API_TOKEN is not set on this deployment', 503);

  try {
    return json({ result: await readBoard(token, body.args) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[monday] items failed:', message);
    return fail(message, 502);
  }
};

/* Deployment check. Reports whether the token was found and which mechanism
   delivered it, so a misconfigured deploy can be diagnosed without guessing.
   Never returns the value — only whether one is present. */
export const GET: APIRoute = async ({ locals }) => {
  const { value, source } = findToken(locals);
  return json({ monday: { set: !!value, source }, boards: Object.values(BOARDS) });
};
