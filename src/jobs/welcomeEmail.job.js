const cron = require("node-cron");
const { sendDailyWelcomeEmails } = require("../services/email/email.service");

function registerWelcomeEmailJob() {
  cron.schedule("0 0 8 * * *", async () => {
    console.log("Running Welcome Email Job");

    try {
      await sendDailyWelcomeEmails();
    } catch (err) {
      console.error("Welcome email job failed:", err);
    }
  });
}

module.exports = registerWelcomeEmailJob;