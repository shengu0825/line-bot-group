export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('收到 LINE Webhook:', req.body);

    // 先立即回應 200，避免超時
    res.status(200).send('OK');

    // 這裡可以非同步處理事件，不影響回應速度
    // handleEvent(req.body.events);
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
