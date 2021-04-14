const axios = require('axios').default;
const { GoogleAuth } = require('google-auth-library');
const { URL } = require('url');

const CREATE_BUCKET_URL = 'https://us-east4-gcp-testing-308520.cloudfunctions.net/createBucket';

/**
 * Processes Google Form Submission
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.processFormSubmit = async (req, res) => {
  const message = req.body;

  const timestamp = message.timestamp;
  const email = message.email;
  const responses = JSON.parse(message.responses);

  console.info(`Timestamp: ${timestamp}`);
  console.info(`    Email: ${email}`);

  // [0] "Create Bucket?"
  // [1] "Bucket Name"
  const [createBucket, bucketName, ...others] = responses;

  console.info(createBucket);
  console.info(bucketName);

  // [2..4] Testing Questions
  const [Q1, Q2, Q3] = others;
  console.info(Q1);
  console.info(Q2);
  console.info(Q3);

  if (createBucket) {
    const TOKEN = await getAuthToken();
    console.info(`TOKEN: ${TOKEN}`);

    const headers = {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const payload = {
      bucketName: bucketName,
    };

    axios.post(CREATE_BUCKET_URL, payload, headers).then(
      (res) => {
        console.log(res);

        res.send(`Bucket creation successful!`);
      },
      (err) => {
        console.error(err);

        res.status(400).send(`Bucket creation failed: ${err}`);
      }
    );
  }
};

const getAuthToken = async () => {
  console.info('getAuthToken');
  const auth = new GoogleAuth();
  console.info(`auth: ${auth}`);

  const aud = new URL(CREATE_BUCKET_URL).origin;
  console.info(`AUD: ${aud}`);

  const client = await auth.getIdTokenClient(aud);
  console.info(client);

  const res = await client.request({ CREATE_BUCKET_URL });

  return res.data;
};
