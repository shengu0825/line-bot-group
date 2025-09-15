export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

export default function handler(req, res) {
  console.log('收到 LINE Webhook:', req.body);
  res.status(200).send('OK');
}
