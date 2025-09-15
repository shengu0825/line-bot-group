import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

export default async function handler(req, res) {
  // 1) 檢查 Token 是否存在
  const hasToken = !!process.env.LINE_CHANNEL_ACCESS_TOKEN;
  console.log('TOKEN 是否存在:', hasToken);

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // 2) 立即回 200，避免 LINE 驗證與 replyToken 過期風險
  res.status(200).send('OK');

  try {
    // 3) 防呆：req.body 與 events
    if (!req.body || !Array.isArray(req.body.events)) {
      console.log('Webhook 格式不符合預期:', req.body);
      return;
    }

    console.log('收到 LINE Webhook:', req.body);

    // 4) 處理事件
    for (const event of req.body.events) {
      if (event.type === 'message' && event.message?.type === 'text') {
        await replyMessage(event.replyToken, `你說了：「${event.message.text}」`);
      }
    }
  } catch (err) {
    console.error('事件處理發生錯誤:', err);
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
    const resultText = await response.text();
    console.log('回覆結果狀態碼:', response.status);
    console.log('回覆結果內容:', resultText);
  } catch (err) {
    console.error('呼叫 LINE 回覆 API 失敗:', err);
  }
}
