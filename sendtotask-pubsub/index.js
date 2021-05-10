const { CloudTasksClient } = require('@google-cloud/tasks');

const VALIDATOR_URL = process.env.VALIDATOR_URL;
const PROJECT = process.env.PROJECT_ID;
const LOCATION = 'us-east4';
const QUEUE = 'validation-queue';
const CHECK_INTERVAL = 1 * 60; // TODO: UPDATE TO 20 MINUTES

/**
 * Sends tasks to tasker
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.sendToTask = async (psMessage) => {
  try {
    const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());
    const attributes = psMessage.attributes;

    console.log(`Message: ${JSON.stringify(message)}`);

    // extract pubsub message data
    const timestamp = attributes.eventTime;
    const bucketName = attributes.bucketId;
    const file = attributes.objectId;

    // create client and construct queue name
    const client = new CloudTasksClient();
    const parent = client.queuePath(PROJECT, LOCATION, QUEUE);

    // https://www.npmjs.com/package/@google-cloud/tasks
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

    // schedule task to be 20 minutes from now
    task.scheduleTime = {
      seconds: CHECK_INTERVAL + Date.now() / 1000,
    };

    // create and send task
    console.log(`Sending task: ${task}`);
    const request = { parent, task };
    const [response] = await client.createTask(request);
    console.log(`Created Task ${JSON.stringify(response)}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
