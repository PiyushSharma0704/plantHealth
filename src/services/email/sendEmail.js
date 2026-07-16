const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../../config/sesClient");

const createSendEmailCommand = (to, from, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },

    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },

      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
    },

    Source: from,
  });
};

const run = async ({ to, subject, body }) => {
  const command = createSendEmailCommand(
    to,
    process.env.SES_FROM_EMAIL,
    subject,
    body,
  );

  return sesClient.send(command);
};

module.exports = { run };
