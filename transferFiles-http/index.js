const { Storage } = require('@google-cloud/storage');

/**
 * Moves files between storage buckets
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.transferFiles = async (req, res) => {
  const storage = new Storage();

  const srcBucket = req.body.srcBucket || 'gcp-bucket-deposit';
  const destBucket = req.body.destBucket || 'gcp-bucket-destination';

  const [files] = await storage.bucket(srcBucket).getFiles();

  files.forEach((file) => {
    console.log(file.name);
  });

  files.forEach(async (file) => {
    await storage
      .bucket(srcBucket)
      .file(file.name)
      .copy(storage.bucket(destBucket).file(file.name));

    console.log(`gs://${srcBucket}/${file} copied to gs://${destBucket}/${file}`);
  });

  res.status(200).send(`${files.length} files moved from ${srcBucket} to ${destBucket}`);
};
