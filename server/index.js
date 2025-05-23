// server/index.js
require('dotenv').config(); // Load environment variables
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Dream Journal server is running on http://localhost:${PORT}`);
});
