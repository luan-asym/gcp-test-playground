const { Storage } = require('@google-cloud/storage');

const LOCATION = 'US-EAST4';
const STORAGE_CLASS = 'STANDARD';
const TOPIC = 'bucket-changed';

/**
 * Trigger for a bucket request
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.bucketRequest = async (message) => {
  const bucketName = message.bucketName || null;

  console.info(`bucketName: ${bucketName}`);

  const storage = new Storage();

  // creates bucket
  await storage.createBucket(bucketName, {
    location: LOCATION,
    storageClass: STORAGE_CLASS,
  });
  console.log(`Bucket ${bucketName} created!`);

  // creates notification for bucket
  await storage.bucket(bucketName).createNotification(TOPIC);
  console.log(`Bucket ${bucketName} registered for ${TOPIC} topic!`);
};
