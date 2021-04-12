/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processFormSubmit = (req, res) => {
  const message = req.body;

  const timestamp = message.timestamp;
  const email = message.email;
  const responses = message.responses;

  console.info(`Timestamp: ${timestamp}`);
  console.info(`    Email: ${email}`);

  // [0] Create Bucket?
  // [1] Bucket Name
  const [createBucket, bucketName, ...others] = responses;

  console.info(createBucket);
  console.info(bucketName);
  console.info(others);

  res.send(message);
};
