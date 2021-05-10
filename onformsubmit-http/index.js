const { PubSub } = require('@google-cloud/pubsub');

const BUCKET_REQUEST_TOPIC = 'bucket-request';
const FIRESTORE_LOG_TOPIC = 'firestore-log';

/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.onFormSubmit = async (req, res) => {
  const message = req.body;

  const submissionTime = message.submissionTime;
  const email = message.email;
  const responses = JSON.parse(message.responses);

  console.info(`Submission Time: ${submissionTime}`);
  console.info(`Email: ${email}`);

  // [0] "Create Bucket?"
  // [1] "Bucket Name"
  const [createBucket, bucketName, ...others] = responses;

  console.info(`Create bucket? ${createBucket}`);
  console.info(`bucketName: ${bucketName}`);

  // [2..4] Testing Questions
  const [Q1, Q2, Q3] = others;
  console.info('--Question Answers--');
  console.info(Q1);
  console.info(Q2);
  console.info(Q3);

  // creates a bucket
  if (createBucket === 'True') {
    // serialize data
    const data = JSON.stringify({
      submissionTime: submissionTime,
      bucketName: bucketName,
      email: email,
      Q1: Q1,
      Q2: Q2,
      Q3: Q3,
    });
    const dataBuffer = Buffer.from(data);

    // publish to pubsub
    try {
      const pubSubClient = new PubSub();

      const bucketRequestMessageId = await pubSubClient
        .topic(BUCKET_REQUEST_TOPIC)
        .publish(dataBuffer);
      const firestoreLogMessageId = await pubSubClient
        .topic(FIRESTORE_LOG_TOPIC)
        .publish(dataBuffer);

      res
        .status(200)
        .send(`MessageID: ${bucketRequestMessageId}, ${firestoreLogMessageId} published!`);
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  } else {
    res.status(200).send('Answers logged');
  }
};
