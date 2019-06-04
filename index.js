require('dotenv').config();
const server = require('./api/server.js');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`\nAPI is running on port http://localhost:${PORT}\n`)
);
