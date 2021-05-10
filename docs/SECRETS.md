# Secrets

> We leverage the use of [Encrypted Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) for automation

## Management

As more secrets are added to the repository, they should be added to a list here

| name          | maintainer | description                        |
| ------------- | ---------- | ---------------------------------- |
| PROJECT_ID    | luan-asym  | The project ID of GCP              |
| GCP_SA_KEY    | luan-asym  | The service account key for GCP    |
| GCP_SA_EMAIL  | luan-asym  | The service account email for GCP  |
| VALIDATOR_URL | luan-asym  | The URL for the Validator function |

## Attaining Secrets

| name          | instructions                                       |
| ------------- | -------------------------------------------------- |
| PROJECT_ID    | contact maintainer                                 |
| GCP_SA_KEY    | contact maintainer                                 |
| GCP_SA_EMAIL  | Use GCP Google Cloud Functions Service Agent email |
| VALIDATOR_URL | use GCP to find Trigger URL for `validator`        |
