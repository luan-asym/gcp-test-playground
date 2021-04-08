/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = (message, context) => {
  console.log(`Event: ${context.eventType}`);
  console.log(`Bucket: ${context.bucketId}`);

  console.log(`Message: ${Buffer.from(message.data, 'base64').toString()}`);
};
