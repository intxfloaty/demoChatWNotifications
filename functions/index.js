const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const cors = require("cors")({ origin: true });
const {setGlobalOptions} = require("firebase-functions/v2");

setGlobalOptions({maxInstances: 10});

const app = initializeApp()

exports.sendNotification = onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      if (request.method !== 'POST') {
        response.status(400).send('Invalid request method. Use POST.');
        return;
      }

      const { token } = request.body;

      if (!token) {
        response.status(400).send('Invalid token provided.');
        return;
      }

      const message = {
        notification: {
          title: 'Test Notification',
          body: 'You have an unread message!',
        },
        token: token,
      };

      const sendResult = await getMessaging().send(message);

      response.status(200).json({
        success: true,
        message: 'Notification sent successfully.',
        details: sendResult,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      response.status(500).send('Internal Server Error');
    }
  })
});
