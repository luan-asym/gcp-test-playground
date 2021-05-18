const { Firestore } = require('@google-cloud/firestore');

/**
 * Trigger to log Google Form into Firestore
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.logToFirestore = async (psMessage) => {
  try {
    const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());

    console.log(`Message: ${JSON.stringify(message)}`);

    // extract message vars
    const collectionName = message.collectionName;
    const bucketName = message.bucketName;

    // create client and get bucket collection
    const firestore = new Firestore();
    const collection = firestore.collection(collectionName);

    // null check bucketName
    if (!bucketName) {
      throw new Error(`bucketName must not be blank`);
    }
    if (!collection) {
      throw new Error(`cannot find collection for ${collectionName}`);
    }

    // add firestore entry with pubsub message
    const document = await collection.doc(bucketName).set(message, { merge: true });
    console.log(`${document.writeTime.toDate()}: Document written to ${collectionName}`);
  } catch (err) {
    console.error(new Error(`Error: ${err.message}`));
    return;
  }

  console.log(`Successful run!`);
};
