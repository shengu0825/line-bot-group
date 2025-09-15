import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  timeout: 5000
});

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
        // **第一步：立即回覆**
        await replyMessage(event.replyToken, `你說了：「${event.message.text}」`);

        // **第二步：再做其他邏輯（非即時回覆的處理）**
        // 例如：存資料庫、呼叫其他 API、分析訊息內容等
        console.log('後續處理邏輯開始...');
        // ...你的額外處理程式碼
      }
    }
  } catch (err) {
    console.error('事件處理錯誤:', err);
  }
}

async function replyMessage(replyToken, text) {
  try {
    console.log('即將呼叫 LINE API，回覆內容:', text);

    const result = await client.replyMessage(replyToken, [
      { type: 'text', text }
    ]);

    console.log('回覆成功:', result);
  } catch (err) {
    console.error('回覆失敗:');
    console.error('錯誤名稱:', err.name);
    console.error('錯誤訊息:', err.message);
    console.error('完整錯誤物件:', err);

    if (err.originalError?.response) {
      console.error('HTTP 狀態碼:', err.originalError.response.status);
      console.error('HTTP 回應內容:', err.originalError.response.data);
    }
  }
}
