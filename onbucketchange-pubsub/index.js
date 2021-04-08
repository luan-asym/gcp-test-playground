/**
 * Trigger for when bucket changes
 *
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.onBucketChange = (message, context) => {
  console.log(`Event ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  console.log(`Message ${Buffer.from(message.data, 'base64').toString()}`);
};
