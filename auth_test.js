require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);

(async () => {
  try {
    const authTest = await web.auth.test();
    console.log('Auth test successful:', authTest);
  } catch (error) {
    console.error('Error during auth test:', error);
  }
})();