/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = (message) => {
  console.log(`Message: ${Buffer.from(message.data, 'base64').toString()}`);

  const attributes = message.attributes;

  console.log(`Bucket: ${attributes.bucketId}`);
  console.log(`Event: ${attributes.eventType}`);
  console.log(`Object: ${attributes.objectId}`);
};
