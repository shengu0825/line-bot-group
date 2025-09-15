import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import axios from 'axios';

export default async function handler(req, res) {
  res.status(200).send('OK');

  const event = req.body.events?.[0];
  if (!event || event.type !== 'message' || event.message?.type !== 'text') return;

  const replyToken = event.replyToken;
  const text = `你說了：「${event.message.text}」`;

  try {
    console.log('即將呼叫 LINE API，回覆內容:', text);

    const response = await axios.post(
      'https://api.line.me/v2/bot/message/reply',
      {
        replyToken,
        messages: [{ type: 'text', text }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        timeout: 5000, // 5 秒超時
        family: 4      // 強制 IPv4
      }
    );

    console.log('HTTP 狀態碼:', response.status);
    console.log('HTTP 回應內容:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('HTTP 狀態碼:', err.response.status);
      console.error('HTTP 回應內容:', err.response.data);
    } else {
      console.error('呼叫失敗:', err.message);
    }
  }
}
