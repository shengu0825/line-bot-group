import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

export default async function handler(req, res) {
  // 🔍 這裡加檢查 Token 是否存在
  console.log('TOKEN 是否存在:', !!process.env.LINE_CHANNEL_ACCESS_TOKEN);

  if (req.method === 'POST') {
    console.log('收到 LINE Webhook:', req.body);
    res.status(200).send('OK'); // 先回 200

    const events = req.body.events;
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await replyMessage(event.replyToken, `你說了：「${event.message.text}」`);
      }
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

async function replyMessage(replyToken, text) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
  };
  const body = JSON.stringify({
    replyToken,
    messages: [{ type: 'text', text }]
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });
    console.log('回覆結果狀態碼:', response.status);
    console.log('回覆結果內容:', await response.text());
  } catch (err) {
    console.error('回覆失敗:', err);
  }
}
