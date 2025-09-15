import express from 'express';

const app = express();

// 讓 Express 能解析 JSON
app.use(express.json());

// 處理 LINE Webhook
app.post('/callback', (req, res) => {
  console.log('收到 LINE Webhook:', req.body);
  res.status(200).send('OK'); // 一定要回 200
});

// 預設首頁（可有可無）
app.get('/', (req, res) => {
  res.send('LINE Bot 正在運行');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
