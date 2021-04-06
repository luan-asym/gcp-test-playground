const { Storage } = require('@google-cloud/storage');

/**
 * Creates Google Storage Bucket
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.createBucket = (req, res) => {
  const LOCATION = 'US-EAST4';
  const STORAGE_CLASS = 'STANDARD';

  const bucketName = req.body.bucketName;

  const storage = new Storage();

  async function create() {
    await storage.createBucket(bucketName, {
      location: LOCATION,
      storageClass: STORAGE_CLASS,
    });
    console.log(`Bucket ${bucketName} created!`);
  }

  create().catch(console.error);

  res.status(200).send(`${bucketName} created!`);
};
