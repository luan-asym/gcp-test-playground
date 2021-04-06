/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processFormSubmit = (req, res) => {
  let message = req.body;

  console.info(message);

  res.send(message);
};
