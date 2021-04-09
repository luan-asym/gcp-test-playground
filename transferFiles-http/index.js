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
  const deleteSrc = req.body.deleteSrc || false;

  const [files] = await storage.bucket(srcBucket).getFiles();

  files.forEach(async (file) => {
    console.log(`Processing ${file.name}...`);

    await storage
      .bucket(srcBucket)
      .file(file.name)
      .copy(storage.bucket(destBucket).file(file.name));

    console.log(`${file.name} copied!`);
    // if (deleteSrc) {
    //   await storage.bucket(srcBucket).file(file.name).delete();
    // }
  });

  res.status(200).send(`${files.length} file(s) moved from ${srcBucket} to ${destBucket}`);
};
