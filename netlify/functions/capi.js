// Netlify Function: Meta Conversions API (CAPI) 中継 (Stage 2)
// 変更点 (from v1):
//   - event_id を必須化（LP→LIFF の dedup キー）
//   - client IP 取得を Netlify 推奨の x-nf-client-connection-ip 優先
//   - sendBeacon 経由の Content-Type は text/plain になる場合があるため JSON parse を堅牢化
//   - event_name ホワイトリスト化（Lead / ViewContent / PageView / CompleteRegistration）
// 環境変数:
//   META_PIXEL_ID     (例: "2450922202046153")
//   META_CAPI_TOKEN   (Pixel 用 System User Token)
//   META_TEST_EVENT_CODE (任意、Test Events 用)

const GRAPH_API_VERSION = 'v23.0';
const ALLOWED_EVENTS = new Set(['Lead', 'ViewContent', 'PageView', 'CompleteRegistration', 'Schedule']);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const PIXEL_ID = process.env.META_PIXEL_ID;
  const TOKEN = process.env.META_CAPI_TOKEN;
  const TEST_CODE = process.env.META_TEST_EVENT_CODE || '';

  if (!PIXEL_ID || !TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'server misconfigured: missing META_PIXEL_ID or META_CAPI_TOKEN' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // event_name バリデーション
  const eventName = payload.event_name || 'Lead';
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { statusCode: 400, body: `event_name "${eventName}" not allowed` };
  }

  // event_id 必須（dedup キー）
  if (!payload.event_id) {
    return { statusCode: 400, body: 'event_id is required for dedup' };
  }

  const now = Math.floor(Date.now() / 1000);
  const headers = event.headers || {};
  const ipRaw =
    headers['x-nf-client-connection-ip'] ||
    headers['x-forwarded-for'] ||
    headers['client-ip'] ||
    '';
  const ip = ipRaw.split(',')[0].trim();
  const ua = payload.client_user_agent || headers['user-agent'] || '';

  const user_data = {};
  if (payload.fbc) user_data.fbc = payload.fbc;
  if (payload.fbp) user_data.fbp = payload.fbp;
  if (ip) user_data.client_ip_address = ip;
  if (ua) user_data.client_user_agent = ua;

  const eventBody = {
    event_name: eventName,
    event_time: payload.event_time || now,
    event_id: payload.event_id,
    event_source_url: payload.event_source_url || '',
    action_source: 'website',
    user_data,
    custom_data: Object.assign(
      { utm_code: payload.utm_code || '' },
      payload.custom_data || {}
    )
  };

  const body = { data: [eventBody] };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  const url =
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'meta api call failed', detail: String(err) })
    };
  }
};
