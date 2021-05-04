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

  const timestamp = message.timestamp;
  const bucketName = message.bucketName;
  const email = message.email;
  const q1 = message.q1;
  const q2 = message.q2;
  const q3 = message.q3;

  console.log(`message: ${JSON.stringify(message)}`);

  // create client and get bucket doc
  const firestore = new Firestore();
  const document = firestore.doc(`bucket/${bucketName}`);

  try {
    await document.set({
      timestamp: timestamp,
      email: email,
      q1: q1,
      q2: q2,
      q3: q3,
    });
    console.log(`Entry logged!`);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }

  res.status(200).send('Sucessful run!');
};
