var admin = require("firebase-admin");

var serviceAccount = require(".././master-mote-353716-firebase-adminsdk-rmvdq-f90ede3fd7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.subscribeToTopic = async (registrationToken, topic) => {
  // See documentation on defining a message payload.

  await admin
    .messaging()
    .subscribeToTopic(registrationToken, topic)
    .then(function (response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log("Successfully subscribed to topic:", response);
    })
    .catch(function (error) {
      console.log("Error subscribing to topic:", error);
    });
};

// Send a message to devices subscribed to the provided topic.

// compare question and answer
// if correct then send email to user with new password

const COMMPARE_QUESTION_ANSWER = async (question_array_1, question_array_2) => {
  try {
    // check if the question and answer are same
    for (let i = 0; i < question_array_1.length; i++) {
      if (
        question_array_1[i].question !== question_array_2[i].question ||
        question_array_1[i].answer !== question_array_2[i].answer
      ) {
        return false;
      } else {
        continue;
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  COMMPARE_QUESTION_ANSWER,
};
