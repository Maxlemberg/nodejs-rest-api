const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log("Server running. Use our API on port: 3000")
})

