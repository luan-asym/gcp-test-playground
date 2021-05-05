const { Firestore } = require('@google-cloud/firestore');

/**
 * Trigger to log Google Form into Firestore
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.logToFirestore = async (psMessage) => {
  const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());

  console.log(`Message: ${JSON.stringify(message)}`);

  // extract pubsub message data
  const timestamp = message.timestamp;
  const bucketName = message.bucketName;
  const email = message.email;
  const q1 = message.q1;
  const q2 = message.q2;
  const q3 = message.q3;

  // create client and get bucket collection
  const firestore = new Firestore();
  const collection = firestore.collection('bucket');

  // add firestore entry with form answers
  try {
    const data = {
      submissionTime: timestamp,
      email: email,
      Q1: q1,
      Q2: q2,
      Q3: q3,
    };

    const document = await collection.doc(bucketName).set(data);
    console.log(`Document written at: ${document.writeTime.toDate()}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
