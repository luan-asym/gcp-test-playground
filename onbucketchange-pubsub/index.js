const { Firestore } = require('@google-cloud/firestore');

/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = async (psMessage) => {
  const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());
  const attributes = psMessage.attribute;

  console.log(`Message: ${JSON.stringify(message)}`);

  const timestamp = attributes.timestamp;
  const bucketName = attributes.bucketId;
  const event = attributes.eventType;
  const file = attributes.objectId;

  console.log(`Bucket: ${bucketName}`);
  console.log(`Event: ${event}`);
  console.log(`Object: ${file}`);

  // create client and get bucket doc
  const firestore = new Firestore();
  const collection = firestore.collection('bucket');

  try {
    const data = {
      lastUpdateEvent: event,
      lastUpdateFile: file,
      lastUpdateTime: timestamp,
    };

    const document = await collection.doc(bucketName).set(data);
    console.log(`Document written at: ${document.writeTime.toDate()}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
