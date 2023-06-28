const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

require('dotenv').config();
const app = require('./app');

mongoose.connect(process.env.DB_URL).then(() => {
  console.log('DB connection successful!');
});

app.listen(process.env.PORT || 8000, () => {
  console.log('server is running...');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
