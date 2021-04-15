const { PubSub } = require('@google-cloud/pubsub');

const TOPIC = 'bucket-request';

/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processFormSubmit = async (req, res) => {
  const message = req.body;

  const timestamp = message.timestamp;
  const email = message.email;
  const responses = JSON.parse(message.responses);

  console.info(`Timestamp: ${timestamp}`);
  console.info(`    Email: ${email}`);

  // [0] "Create Bucket?"
  // [1] "Bucket Name"
  const [createBucket, bucketName, ...others] = responses;

  console.info(createBucket);
  console.info(bucketName);

  // [2..4] Testing Questions
  const [Q1, Q2, Q3] = others;
  console.info(Q1);
  console.info(Q2);
  console.info(Q3);

  if (createBucket) {
    const pubSubClient = new PubSub();

    // serialize data
    const data = JSON.stringify({
      timestamp: timestamp,
      bucketName: bucketName,
      email: email,
      q1: Q1,
      q2: Q2,
      q3: Q3,
    });
    const dataBuffer = Buffer.from(data);

    // publish to pubsub
    try {
      const messageId = await pubSubClient.topic(TOPIC).publish(dataBuffer);

      res.status(200).send(`messageId: ${messageId} published!`);
    } catch (err) {
      res.status(400).send(`Error: ${err.message}`);
    }
  }
};
