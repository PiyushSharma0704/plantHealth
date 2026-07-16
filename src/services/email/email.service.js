const { subDays, startOfDay, endOfDay } = require("date-fns");
const UserModel = require("../../models/Users");
const { run } = require("./sendEmail");

const welcomeTemplate = require("./templates/welcomeEmail");

async function sendDailyWelcomeEmails() {
  const yesterday = subDays(new Date(), 1);

  const users = await UserModel.find({
    createdAt: {
      $gte: startOfDay(yesterday),
      $lt: endOfDay(yesterday),
    },
  });

  console.log(`Found ${users.length} users`);

  await Promise.all(
    users.map((user) =>
      run({
        to: user.email,
        subject: "Welcome to Plant Health",
        body: welcomeTemplate(user),
      })
    )
  );
}

module.exports = {
  sendDailyWelcomeEmails,
};