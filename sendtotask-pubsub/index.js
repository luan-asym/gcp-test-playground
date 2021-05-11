const { CloudTasksClient } = require('@google-cloud/tasks');

const VALIDATOR_URL = process.env.VALIDATOR_URL;
const PROJECT = process.env.PROJECT_ID;
const GCP_SA_EMAIL = process.env.GCP_SA_EMAIL;

const LOCATION = 'us-east4';
const QUEUE = 'validation-queue';
const CHECK_INTERVAL = 20 * 60; // 20 minutes

/**
 * Sends tasks to tasker
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.sendToTask = async (psMessage) => {
  try {
    const message = JSON.parse(Buffer.from(psMessage.data, 'base64').toString());

    console.log(`Message: ${JSON.stringify(message)}`);

    // extract pubsub message data
    const timestamp = message.lastUpdateTime;
    const bucketName = message.bucketName || 'bucket';
    const file = message.lastUpdateFile;

    // create client and construct queue name
    const client = new CloudTasksClient();
    const parent = client.queuePath(PROJECT, LOCATION, QUEUE);

    // create httpRequest task
    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: VALIDATOR_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        oidcToken: {
          serviceAccountEmail: GCP_SA_EMAIL,
        },
      },
      scheduleTime: {
        seconds: CHECK_INTERVAL + Date.now() / 1000,
      },
    };

    // create and add body
    const payload = {
      timestamp: timestamp,
      bucketName: bucketName,
      file: file,
    };
    task.httpRequest.body = payload;
    // task.httpRequest.body = new Uint8Array(
    //   JSON.stringify(payload)
    //     .split('')
    //     .map((char) => char.charCodeAt(0))
    // );

    // create and send task
    console.log(`Sending task: ${JSON.stringify(task)}`);
    const request = { parent, task, view: 'FULL' };
    const [response] = await client.createTask(request);
    console.log(`Created Task ${JSON.stringify(response.name)}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
