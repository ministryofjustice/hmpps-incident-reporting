# Deployment Notes

Deployment is usually handled through GitHub Actions, but sometimes it’s useful to access the cluster directly
(e.g. to diagnose problems).

## Prerequisites

Ensure you have kubectl v1.25 (or compatible) and helm v3 clients installed.

You will need to be a member of the `@ministryofjustice/hmpps-incident-reporting` team on github and
have authenticated kubectl with [Cloud Platform](https://user-guide.cloud-platform.service.justice.gov.uk/).

## Environments & namespaces

| Environment | Kubernetes namespace             |
|-------------|----------------------------------|
| dev         | hmpps-incident-reporting-dev     |
| preprod     | hmpps-incident-reporting-preprod |
| prod        | hmpps-incident-reporting-prod    |


## Useful commands (run from this directory)

List all current releases (not just this chart):

```shell
helm --namespace ${NAMESPACE} list
```

List history of this chart’s releases:

```shell
helm --namespace ${NAMESPACE} history hmpps-incident-reporting
```

Roll this chart back to a previous release (where `${REVISION_NUMBER}` is taken from the history list):

```shell
helm --namespace ${NAMESPACE} rollback hmpps-incident-reporting ${REVISION_NUMBER} --wait
```

Lint the chart templates:

```shell
helm --namespace ${NAMESPACE} lint \
  ./hmpps-incident-reporting --values values-${ENVIRONMENT}.yaml \
  --strict --with-subcharts --debug
```

Render complete chart for debugging:

```shell
helm template ./hmpps-incident-reporting --values values-${ENVIRONMENT}.yaml
```

Manually deploy the complete helm chart:

```shell
helm upgrade hmpps-incident-reporting ./hmpps-incident-reporting \
  --install --wait --force --reset-values --timeout 5m --history-max 10 \
  --dry-run \  # remove to actually deploy
  --namespace ${NAMESPACE} \
  --values values-${ENVIRONMENT}.yaml \
  --set generic-service.image.tag=${APP_VERSION}  # this is normally set by CI as [date]-[build number]-[git commit], e.g. 2022-07-11.5276.677f0a8
```
