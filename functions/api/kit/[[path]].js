/* ── Kit API 同源代理：key 存於環境變數 KIT_API_KEY，僅放行訂閱三端點 ── */
const ALLOWED = [
  /^v4\/subscribers$/,
  /^v4\/tags\/\d+\/subscribers$/,
  /^v4\/sequences\/\d+\/subscribers$/,
];

export async function onRequest({ request, env, params }) {
  const json = (obj, status) => new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const path = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!ALLOWED.some((re) => re.test(path))) return json({ error: 'forbidden' }, 403);
  if (!env.KIT_API_KEY) return json({ error: 'server not configured' }, 500);

  const body = await request.text();
  if (body.length > 4096) return json({ error: 'payload too large' }, 413);

  const res = await fetch(`https://api.kit.com/${path}`, {
    method: 'POST',
    headers: { 'X-Kit-Api-Key': env.KIT_API_KEY, 'Content-Type': 'application/json' },
    body,
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
