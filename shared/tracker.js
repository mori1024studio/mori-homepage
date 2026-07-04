/* ── Mori 測驗後台回報（quiz-tracker）── */
const TRACKER_BASE = 'https://quiz-tracker.mori1024.workers.dev';
let _mtId = null;

function _mtSlug() {
  return location.pathname.split('/').filter(Boolean)[1] || '';
}

/* 各測驗結果畫面的標題元素 id 不完全一致，依序嘗試取第一個有內容的 */
function _mtResultLabel() {
  const ids = ['r-type', 'r-freedom', 'r-badge'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.textContent.trim()) return el.textContent.trim();
  }
  return '';
}

/* 通用分流公式：依副業意象調查 3 題（A/B/C/D）粗略判斷跟進優先度 */
function computeSegment(q1, q2, q3) {
  if ((q1 === 'C' || q1 === 'D') && q2 === 'C' && (q3 === 'C' || q3 === 'D')) return 'partner';
  if (q2 === 'A' && (q3 === 'A' || q3 === 'B')) return 'client';
  if (q1 === 'A' || q3 === 'D') return 'warm';
  return 'cold';
}

/* 測驗解鎖結果時呼叫：quiz(可省略,自動取路徑) / result / q1-3 */
function sendQuizTrack(result, q1, q2, q3) {
  try {
    const segment = (q1 && q2 && q3) ? computeSegment(q1, q2, q3) : '';
    fetch(TRACKER_BASE + '/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quiz: _mtSlug(), result: result || '', q1: q1 || '', q2: q2 || '', q3: q3 || '', segment }),
      keepalive: true,
    }).then(r => r.json()).then(d => { if (d && d.id) _mtId = d.id; }).catch(() => {});
  } catch (e) {}
}

/* Email 送出成功時呼叫：補寫 email 到剛才那筆記錄（沒有 id 就退化成新建一筆） */
function sendQuizEmail(email) {
  try {
    if (_mtId) {
      fetch(TRACKER_BASE + '/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: _mtId, email }),
        keepalive: true,
      }).catch(() => {});
    } else {
      fetch(TRACKER_BASE + '/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quiz: _mtSlug(), email }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (e) {}
}
