import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import axios from 'axios';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

export default async function handler(req, res) {
  console.log('TOKEN 是否存在:', !!process.env.LINE_CHANNEL_ACCESS_TOKEN);

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // 先回 200，避免 replyToken 過期
  res.status(200).send('OK');

  try {
    if (!req.body || !Array.isArray(req.body.events)) {
      console.error('Webhook 格式不正確:', req.body);
      return;
    }

    for (const event of req.body.events) {
      console.log('收到 LINE Webhook:', event);

      if (event.type === 'message' && event.message?.type === 'text') {
        await replyMessage(event.replyToken, `你說了：「${event.message.text}」`);
      }
    }
  } catch (err) {
    console.error('事件處理錯誤:', err);
  }
}

async function replyMessage(replyToken, text) {
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
