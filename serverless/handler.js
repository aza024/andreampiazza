'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

function sendEmail(formData, callback) {
  const emailParams = {
    Source: process.env.EMAIL,
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: [process.env.EMAIL],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from https://aza024.github.io',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.contactForm = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        "Access-Control-Allow-Origin": {
          "type": "string"
      },
      "Access-Control-Allow-Methods": {
          "type": "string"
      },
      "Access-Control-Allow-Headers": {
          "type": "string"
      },
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': 'https://aza024.github.io',
        'Access-Control-Allow-Headers': 'Origin',
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, { statusCode: 400, body: JSON.stringify(error) });
  });
};