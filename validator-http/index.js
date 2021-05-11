const { Firestore } = require('@google-cloud/firestore');

/**
 * Validates files based on Firestore log
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.validator = async (req, res) => {
  try {
    const message = req.body;

    console.log(`Request: ${JSON.stringify(req)}`);
    console.log(`Body: ${JSON.stringify(message)}`);

    const bucketName = message.bucketName || 'bucket';

    console.log(`Bucket: ${bucketName}`);

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
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  res.status(200).send(`Successful run!`);
};
