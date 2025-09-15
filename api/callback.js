import express from 'express';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

app.post('/callback', (req, res) => {
  console.log('收到 LINE Webhook:', req.body);
  res.status(200).send('OK');
});

export default serverless(app);
