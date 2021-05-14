const { PubSub } = require('@google-cloud/pubsub');

const FIRESTORE_LOG_TOPIC = 'firestore-log';
const FIRESTORE_COLLECTION = 'bucket-status';

/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = async (psMessage) => {
  try {
    const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());
    const attributes = psMessage.attributes;

    console.log(`Message: ${JSON.stringify(message)}`);

    // extract pubsub message data
    const timestamp = attributes.eventTime;
    const event = attributes.eventType;
    const bucketName = attributes.bucketId;
    const file = attributes.objectId;

    // serialize data for PubSub
    const pubsubData = JSON.stringify({
      collectionName: FIRESTORE_COLLECTION,
      bucketName: bucketName,
      lastUpdateEvent: event,
      lastUpdateFile: file,
      lastUpdateTime: timestamp,
    });
    const dataBuffer = Buffer.from(pubsubData);

    // update firestore entry with event data
    const pubSubClient = new PubSub();

    const firestoreLogMessageId = await pubSubClient.topic(FIRESTORE_LOG_TOPIC).publish(dataBuffer);

    console.log(`MessageID: ${firestoreLogMessageId}, ${taskRequestMessageId} published!`);
  } catch (err) {
    console.error(new Error(`Error: ${err.message}`));
    return;
  }

  console.log(`Successful run!`);
};
