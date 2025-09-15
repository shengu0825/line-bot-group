import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
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

  res.status(200).send('OK');

  try {
    if (!req.body || !Array.isArray(req.body.events)) {
      console.error('Webhook 格式不正確:', req.body);
      return;
    }

    console.log('收到 LINE Webhook:', req.body);

    for (const event of req.body.events) {
      console.log('收到的 message 內容:', event.message);

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
    const result = await client.replyMessage(replyToken, [
      { type: 'text', text }
    ]);
    console.log('回覆成功:', result);
  } catch (err) {
    console.error('回覆失敗:');
    console.error('錯誤名稱:', err.name);
    console.error('錯誤訊息:', err.message);
    console.error('完整錯誤物件:', err);
    if (err.originalError?.response?.data) {
      console.error('LINE API 回覆內容:', err.originalError.response.data);
    }
  }
}
