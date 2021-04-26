# Transfer Files

> Creates bucket and creates Pub/Sub notification to watch for changes

<p align="center">
  <a href="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-transferfiles.http.yml">
    <img src="https://github.com/luan-asym/gcp-test-playground/actions/workflows/deploy-transferfiles.http.yml/badge.svg">
  </a>
</p>

## Params

| key          | value   | default                  | description                              |
| ------------ | ------- | ------------------------ | ---------------------------------------- |
| `srcBucket`  | string  | `gcp-bucket-deposit`     | The source bucket                        |
| `destBucket` | string  | `gcp-bucket-destination` | The destination bucket                   |
| `deleteSrc`  | boolean | false                    | Deletes file from `srcBucket` after copy |
