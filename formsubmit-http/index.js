/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.onSubmit = (req, res) => {
  let message = req.body;

  console.info(message);

  res.send(message);
};
