const { Firestore } = require('@google-cloud/firestore');

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
    const lastUpdateFile = message.lastUpdateFile;
    const lastUpdateEvent = message.lastUpdateEvent;

    console.log(`lastUpdateTime: ${lastUpdateTime}`);
    console.log(`Bucket: ${bucketName}`);
    console.log(`lastUpdateFile: ${lastUpdateFile}`);
    console.log(`lastUpdateEvent: ${lastUpdateEvent}`);

    // create client and get bucket collection
    const firestore = new Firestore();
    const collection = firestore.collection('bucket');

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

    // checks if submission has changed
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  res.status(200).send(`Successful run!`);
};
