require('dotenv').config();
console.log("SLACK_SIGNING_SECRET:", process.env.SLACK_SIGNING_SECRET);
console.log("SLACK_BOT_TOKEN:", process.env.SLACK_BOT_TOKEN);