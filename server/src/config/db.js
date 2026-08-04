const mongoose = require('mongoose');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS setServers error if not supported
}

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/ai_interview_coach';

    await mongoose.connect(MONGO_URI);

    console.log('✅ Successfully connected to MongoDB.');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;