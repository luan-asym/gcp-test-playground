const { Storage } = require('@google-cloud/storage');

/**
 * Moves files between storage buckets
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.transferFiles = async (req, res) => {
  try {
    const storage = new Storage();

    const srcBucketName = req.body.srcBucket || 'gcp-bucket-deposit';
    const destBucketName = req.body.destBucket || 'gcp-bucket-destination';
    const deleteSrc = req.body.deleteSrc || false;

    // check if buckets exist
    let srcBucket, srcBucketExists, destBucket, destBucketExists;
    try {
      srcBucketExists = await storage.bucket(srcBucketName).exists();

      if (srcBucketExists[0]) {
        srcBucket = storage.bucket(srcBucketName);
      } else {
        res.status(404).send(`srcBucket: ${srcBucket} not found`);
      }
    } catch (err) {
      console.error(err.message);
      res.status(401).send(`Unauthorized to access ${srcBucketName}`);
    }

    try {
      destBucketExists = await storage.bucket(destBucketName).exists();

      if (destBucketExists[0]) {
        destBucket = storage.bucket(destBucketName);
      } else {
        res.status(404).send(`destBucket: ${destBucket} not found`);
      }
    } catch (err) {
      console.error(err.message);
      res.status(401).send(`Unauthorized to access ${destBucketName}`);
    }

    // iterate through all files in srcBucket
    const [srcFiles] = await srcBucket.getFiles();

    for (file of srcFiles) {
      console.log(`Processing ${file.name}...`);

      // check if file exists
      const existsData = await destBucket.file(file.name).exists();
      if (existsData[0]) {
        console.log(`${file.name} already exists!`);

        // parse object metadata
        const [metadata] = await destBucket.file(file.name).getMetadata();
        const archivedName = `${file.name}-${metadata.timeCreated}`;
        const contentType = metadata.contentType;

        // ignore folders
        console.log(`${file.name} is a ${contentType}`);
        if (contentType != 'text/plain') {
          // archive file
          console.log(`Renaming ${file.name} to ${archivedName}`);
          await destBucket.file(file.name).rename(archivedName);
        } else {
          console.log(`Skipping... ${file.name}`);
        }
      }

      // copy over file
      await srcBucket.file(file.name).copy(destBucket.file(file.name));
      console.log(`${file.name} copied!`);

      // if flagged, delete file from srcBucket
      if (deleteSrc) {
        await srcBucket.file(file.name).delete();
        console.log(`${file} deleted!`);
      }
    }
  } catch (err) {
    console.error(new Error(`Error: ${err.message}`));
  }

  res
    .status(200)
    .send(`${srcFiles.length} file(s) moved from ${srcBucketName} to ${destBucketName}`);
};
