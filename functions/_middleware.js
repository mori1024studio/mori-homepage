/* ── 舊網域 301：mori-homepage.pages.dev → mentelume.com ──
   只轉正式 pages.dev 主機名（preview 部署與自訂網域不受影響）；
   排除 /api/* 讓舊快取頁面的 POST 呼叫維持可用 */
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'mori-homepage.pages.dev' && !url.pathname.startsWith('/api/')) {
    url.hostname = 'mentelume.com';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
