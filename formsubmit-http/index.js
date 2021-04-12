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
  console.info(responses);

  res.send(message);
};
