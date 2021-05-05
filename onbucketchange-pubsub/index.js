const { Firestore } = require('@google-cloud/firestore');

/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = async (psMessage) => {
  const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());
  const attributes = psMessage.attributes;

  console.log(`Message: ${JSON.stringify(message)}`);

  // extract pubsub message data
  const timestamp = attributes.eventTime;
  const event = attributes.eventType;
  const bucketName = attributes.bucketId;
  const file = attributes.objectId;

  // create client and get bucket collection
  const firestore = new Firestore();
  const collection = firestore.collection('bucket');

  // update firestore entry with event data
  try {
    const data = {
      lastUpdateEvent: event,
      lastUpdateFile: file,
      lastUpdateTime: timestamp,
    };

    const document = await collection.doc(bucketName).set(data, { merge: true });
    console.log(`Document written at: ${document.writeTime.toDate()}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
