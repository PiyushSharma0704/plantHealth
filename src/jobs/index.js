const registerWelcomeEmailJob = require("./welcomeEmail.job");

function initializeJobs() {
  registerWelcomeEmailJob();

  console.log("Cron jobs initialized");
}

module.exports = initializeJobs;