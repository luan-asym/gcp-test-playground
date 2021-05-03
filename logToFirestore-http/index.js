const { PubSub } = require('@google-cloud/pubsub');
const { Firestore } = require('@google-cloud/firestore');

const TOPIC = 'firestore-log';

/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.logToFirestore = async (req, res) => {
  const message = req.body;

  console.log(`message: ${JSON.stringify(message)}`);

  res.status(200).send('Sucessful run!');
};
