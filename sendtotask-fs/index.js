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
 * @param {!Object} event The Cloud Functions event.
 */
exports.sendToTask = async (event) => {
  try {
    const message = event;

    console.log(`Message: ${JSON.stringify(message)}`);

    // extract pubsub message data
    const lastUpdateTime = message.lastUpdateTime;
    const bucketName = message.bucketName;
    const lastUpdateFile = message.lastUpdateFile;
    const lastUpdateEvent = message.lastUpdateEvent;

    // create client and construct queue name
    const client = new CloudTasksClient();
    const parent = client.queuePath(PROJECT, LOCATION, QUEUE);

    // create httpRequest task
    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: VALIDATOR_URL,
        headers: {
          'Content-Type': 'application/octet-stream',
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
      lastUpdateTime: lastUpdateTime,
      bucketName: bucketName,
      lastUpdateFile: lastUpdateFile,
      lastUpdateEvent: lastUpdateEvent,
    };
    task.httpRequest.body = new Uint8Array(
      JSON.stringify(payload)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    // TODO: check if another task exists?
    // https://googleapis.dev/nodejs/tasks/latest/google.cloud.tasks.v2beta2.CloudTasks.html

    // create and send task
    console.log(`Sending task: ${JSON.stringify(task)}`);
    const createTaskRequest = { parent, task, view: 'FULL' };
    const [createTaskResponse] = await client.createTask(createTaskRequest);
    console.log(`Created Task ${JSON.stringify(createTaskResponse.name)}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  console.log(`Successful run!`);
};
