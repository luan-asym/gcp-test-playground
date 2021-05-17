const { Firestore } = require('@google-cloud/firestore');
const { PubSub } = require('@google-cloud/pubsub');

const FIRESTORE_LOG_TOPIC = 'firestore-log';
const FIRESTORE_ANSWERS_COLLECTION = 'bucket-answers';
const FIRESTORE_STATUS_COLLECTION = 'bucket-status';
const COMPLETED_TASK_STATUS = 'COMPLETED';

// cloud clients
let firestore;
let pubSubClient;

/**
 * Validates files based on Firestore log
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.validator = async (req, res) => {
  try {
    const message = JSON.parse(Buffer.from(req.body, 'base64').toString('ascii'));

    console.log(`Body: ${JSON.stringify(message)}`);

    // extract body info
    const lastUpdateTime = message.lastUpdateTime;
    const bucketName = message.bucketName;

    console.log(`${bucketName} lastUpdateTime: ${lastUpdateTime}`);

    // create client and get answers
    firestore = new Firestore();
    const collection = firestore.collection(FIRESTORE_ANSWERS_COLLECTION);

    // null check bucketName
    if (!bucketName) {
      throw new Error('bucketName must not be blank');
    }

    // check firestore entry with form answers
    const documentRef = await collection.doc(bucketName).get();
    const data = documentRef.data();

    // prints out data of bucket
    console.log(`DATA: ${JSON.stringify(data)}`);
    console.log(`${bucketName} submissionTime: ${data.submissionTime}`);
    console.log(`Submitted by: ${data.email}`);

    // logs that the files are validated
    // serialize data for PubSub
    const pubSubData = JSON.stringify({
      collectionName: FIRESTORE_STATUS_COLLECTION,
      taskName: '',
      taskStatus: COMPLETED_TASK_STATUS,
    });
    const dataBuffer = Buffer.from(pubSubData);

    // update firestore entry with event data
    pubSubClient = new PubSub();
    const firestoreLogMessageId = await pubSubClient.topic(FIRESTORE_LOG_TOPIC).publish(dataBuffer);
    console.log(`MessageID: ${firestoreLogMessageId} published!`);
  } catch (err) {
    console.error(new Error(`Error: ${err.message}`));
    res.status(400).send(`Error: ${err.message}`);
  }

  res.status(200).send(`Successful run!`);
};
