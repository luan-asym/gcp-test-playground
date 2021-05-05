const { Firestore } = require('@google-cloud/firestore');

const TOPIC = 'firestore-log';

/**
 * Trigger to log Google Form into Firestore
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.logToFirestore = async (psMessage) => {
  const message = Buffer.from(psMessage.data, 'base64').toString();

  console.log(`Message: ${message}`);

  const timestamp = message.timestamp;
  const bucketName = message.bucketName;
  const email = message.email;
  const q1 = message.q1;
  const q2 = message.q2;
  const q3 = message.q3;

  // create client and get bucket doc
  const firestore = new Firestore();
  const collection = firestore.collection('bucket');

  try {
    const data = {
      timestamp: timestamp,
      email: email,
      q1: q1,
      q2: q2,
      q3: q3,
    };
    console.log(`data: ${data}`);

    const document = await collection.add(data);
    console.log(`document: ${document}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
