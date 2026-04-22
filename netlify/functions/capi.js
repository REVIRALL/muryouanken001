// Netlify Function: Meta Conversions API (CAPI) 中継
// 役割: LIFF 中間ページから受け取った Lead イベントを Meta サーバーに転送。
// 環境変数:
//   META_PIXEL_ID     (例: "2450922202046153")
//   META_CAPI_TOKEN   (Pixel 用 System User Token。Netlify の env に設定)
//   META_TEST_EVENT_CODE (任意。Test Events 用)

const GRAPH_API_VERSION = 'v23.0';

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

  const now = Math.floor(Date.now() / 1000);
  const ip = (event.headers && (event.headers['x-forwarded-for'] || event.headers['client-ip'])) || '';
  const ua = payload.client_user_agent || (event.headers && event.headers['user-agent']) || '';

  const user_data = {};
  if (payload.fbc) user_data.fbc = payload.fbc;
  if (payload.fbp) user_data.fbp = payload.fbp;
  if (ip) user_data.client_ip_address = ip.split(',')[0].trim();
  if (ua) user_data.client_user_agent = ua;

  const body = {
    data: [
      {
        event_name: payload.event_name || 'Lead',
        event_time: payload.event_time || now,
        event_id: payload.event_id || `lead_${now}`,
        event_source_url: payload.event_source_url || '',
        action_source: 'website',
        user_data,
        custom_data: {
          utm_code: payload.utm_code || ''
        }
      }
    ]
  };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;
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
