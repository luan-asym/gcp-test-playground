const { Storage } = require('@google-cloud/storage');

const LOCATION = 'US-EAST4';
const STORAGE_CLASS = 'STANDARD';
const TOPIC = 'bucket-changed';

/**
 * Creates Google Storage Bucket
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.createBucket = async (req, res) => {
  const bucketName = req.body.bucketName;
  const location = req.body.location || LOCATION;
  const storageClass = req.body.storageClass || STORAGE_CLASS;

  const storage = new Storage();

  // creates bucket
  await storage.createBucket(bucketName, {
    location: location,
    storageClass: storageClass,
  });
  console.log(`Bucket ${bucketName} created!`);

  // creates notification for bucket
  await storage.bucket(bucketName).createNotification(TOPIC);
  console.log(`Bucket ${bucketName} registered for ${TOPIC} topic!`);

  res.status(200).send(`${bucketName} created and setup`);
};
