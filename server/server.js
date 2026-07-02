const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});