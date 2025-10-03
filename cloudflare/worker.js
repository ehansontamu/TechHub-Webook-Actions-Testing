export default {
  async fetch(req, env) {
    if (req.method !== 'POST') return new Response('ok', { status: 200 });

    const text = await req.text();
    let payload = {};
    try { payload = JSON.parse(text); } catch { payload = { raw: text }; }

    const res = await fetch(`https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GH_PAT}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'bigcommerce_webhook',
        client_payload: payload
      })
    });

    // Always 200 back to BigCommerce so they don't retry
    return new Response(`dispatched ${res.status}`, { status: 200 });
  }
}
