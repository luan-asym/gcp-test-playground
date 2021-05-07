const { CloudTasksClient } = require('@google-cloud/tasks');

const VALIDATOR_URL = process.env.VALIDATOR_URL;
const PROJECT = process.env.PROJECT_ID;
const LOCATION = 'us-east4';
const QUEUE = 'validation-queue';

/**
 * Sends tasks to tasker
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendToTask = async (req, res) => {
  const client = new CloudTasksClient();

  // https://www.npmjs.com/package/@google-cloud/tasks
  const parent = client.queuePath(PROJECT, LOCATION, QUEUE);

  console.log(`VALIDATOR URL: ${VALIDATOR_URL}`);

  const task = {
    httpRequest: {
      httpMethod: 'POST',
      url: VALIDATOR_URL,
      body: {
        bucketName: 'gcp-bucket-firestore',
      },
    },
  };

  const request = {
    parent: parent,
    task: task,
  };

  console.log(`Sending task: ${task}`);
  const [response] = await client.createTask(request);
  console.log(`Created Task ${response}`);

  res.status(200).send(`Completed!`);
};
