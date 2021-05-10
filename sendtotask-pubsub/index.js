const { CloudTasksClient } = require('@google-cloud/tasks');

const VALIDATOR_URL = process.env.VALIDATOR_URL;
const PROJECT = process.env.PROJECT_ID;
const LOCATION = 'us-east4';
const QUEUE = 'validation-queue';

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
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
