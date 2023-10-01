const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
const router = require('./routes/routes')
const cookieParser = require('cookie-parser')
const authenticate = require("./middleware/authenticate")

dotenv.config()
require('./config/database')
// Add body-parser middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// router set
app.use(router)

//
app.use(authenticate);

app.use(cookieParser())

//  server listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
