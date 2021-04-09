# Create Bucket

> Creates bucket and creates Pub/Sub notification to watch for changes

<p align="center">
  <a href="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-transferfiles.html.yml">
    <img src="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-transferfiles.html.yml/badge.svg">
  </a>
</p>

## Params

| key          | value    | default                  | description                              |
| ------------ | -------- | ------------------------ | ---------------------------------------- |
| `srcBucket`  | string   | `gcp-bucket-deposit`     | The source bucket                        |
| `destBucket` | string   | `gcp-bucket-destination` | The destination bucket                   |
| `deleteSrc`  | boolean  | false                    | Deletes file from `srcBucket` after copy |
| `fileList`   | [string] | _all files in bucket_    | The list of files to copy                |
