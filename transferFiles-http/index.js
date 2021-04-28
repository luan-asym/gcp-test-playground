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

  const [srcFiles] = await storage.bucket(srcBucket).getFiles();

  console.log(`srcFiles: ${srcFiles}`);

  srcFiles.forEach(async (file) => {
    console.log(`Processing ${file.name}...`);

    if (await storage.bucket(destBucket).file(file).exists()) {
      console.log(`${file.name} already exists!`);
    }

    await storage
      .bucket(srcBucket)
      .file(file.name)
      .copy(storage.bucket(destBucket).file(`${file.name}-${new Date().toISOString()}`));

    console.log(`${file.name} copied!`);
    if (deleteSrc) {
      await storage.bucket(srcBucket).file(file.name).delete();
      console.log(`${file} deleted!`);
    }
  });

  res.status(200).send(`${srcFiles.length} file(s) moved from ${srcBucket} to ${destBucket}`);
};
