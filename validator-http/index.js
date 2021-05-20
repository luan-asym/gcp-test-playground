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
    const lastUpdateFile = message.lastUpdateFile;
    const email = message.email;
    const bucketName = message.bucketName;

    console.log(`${lastUpdateTime} ${bucketName}: ${email} updated ${lastUpdateFile}`);

    // create client and get collections
    firestore = new Firestore();
    const answersCollection = firestore.collection(FIRESTORE_ANSWERS_COLLECTION);
    const statusCollection = firestore.collection(FIRESTORE_STATUS_COLLECTION);

    // null check bucketName
    if (!bucketName) {
      throw new Error('bucketName must not be blank');
    }

    // TODO: refactor this to a Promise.all()
    // check firestore entry with form answers
    const answersDocRef = await answersCollection.doc(bucketName).get();
    const answersData = answersDocRef.data();
    console.log(`DATA (answers): ${JSON.stringify(answersData)}`);

    // check firestore entry with status
    const statusDocRef = await statusCollection.doc(bucketName).get();
    const statusData = statusDocRef.data();
    console.log(`DATA (status): ${JSON.stringify(statusData)}`);

    // check for firestore status logging
    // if not, do not validate
    if (statusData.taskStatus == COMPLETED_TASK_STATUS) {
      throw new Error('Pending tasks were already completed');
    }

    // logs that the files are validated
    // serialize data for PubSub
    const pubSubData = JSON.stringify({
      bucketName: bucketName,
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
    console.error(new Error(err.message));
  }

  res.status(200).send(`Successful Run!`);
};
