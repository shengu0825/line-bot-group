import fetch from 'node-fetch';

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

    console.log('收到 LINE Webhook:', req.body);

    for (const event of req.body.events) {
      console.log('收到的 message 內容:', event.message);

      // 直接回覆原文
      if (event.type === 'message' && event.message?.type === 'text') {
        await replyMessage(event.replyToken, `你說了：「${event.message.text}」`);
      }
    }
  } catch (err) {
    console.error('事件處理錯誤:', err);
  }
}

async function replyMessage(replyToken, text) {
  console.log('準備回覆訊息，replyToken:', replyToken, 'text:', text);

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

    const resultText = await response.text();
    console.log('回覆結果內容:', resultText || '(空)');

    if (!response.ok) {
      console.error('LINE API 回覆非 200，可能原因：Token 錯誤、replyToken 過期、訊息格式錯誤');
    }
  } catch (err) {
    console.error('呼叫 LINE API 失敗:', err);
  }
}
