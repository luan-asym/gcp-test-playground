const { CloudTasksClient } = require('@google-cloud/tasks');

const PROJECT = process.env.PROJECT_ID;
const LOCATION = 'us-east4';
const QUEUE = 'validation-queue';

/**
 * Moves files between storage buckets
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendToTask = async (req, res) => {
  const client = new CloudTasksClient();

  console.log(`QUEUE: ${QUEUE}`);
  console.log(`LOCATION: ${LOCATION}`);
  console.log(`PROJECT: ${PROJECT}`);

  const parent = client.queuePath(PROJECT, LOCATION, QUEUE);

  res.status(200).send(`Completed!`);
};
