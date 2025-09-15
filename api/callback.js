import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  timeout: 5000 // 5 秒超時
});

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
