const dotenv = require('dotenv');

function config() {
  if (process.env.TEST_ENV === 'QA') {
    dotenv.config({ path: './config/.env.qa' });
  } else if (process.env.TEST_ENV === 'STAGE') {
    dotenv.config({ path: './config/.env.stage' });
  } else {
    dotenv.config({ path: './config/.env.qa' });
  }
}

module.exports = { config };