# Bucket Request

> Creates bucket from a Pub/Sub trigger and creates Pub/Sub notification to watch for changes

<p align="center">
  <a href="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-bucketrequest.pubsub.yml">
    <img src="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-bucketrequest.pubsub.yml/badge.svg">
  </a>
</p>

## Additional Notes

- This function requires a preexisiting Pub/Sub topic `bucket-changed` and `bucket-request` in order to work properly

## References

- https://cloud.google.com/storage/docs/reporting-changes
