# Create Bucket

> Creates bucket and creates Pub/Sub notification to watch for changes

<p align="center">
  <a href="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-createbucket.html.yml">
    <img src="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-createbucket.html.yml/badge.svg">
  </a>
</p>

## Params

| key            | value   | default          | description                                                                                                        |
| -------------- | ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `bucketName`   | string  | **REQUIRED**     | The name of the bucket to be created                                                                               |
| `location`     | string  | `US-EAST4`       | [The storage location of the bucket](https://cloud.google.com/storage/docs/locations#location-r)                   |
| `storageClass` | string  | `STANDARD`       | [The storage class of the bucket](https://cloud.google.com/storage/docs/storage-classes#available_storage_classes) |
| `topic`        | boolean | `bucket-changed` | The Pub/Sub topic to publish bucket changes to                                                                     |

## Additional Notes

- [The default topic `bucket-changed` needs to be created for the function to work properly](https://cloud.google.com/storage/docs/reporting-changes#prereqs)
