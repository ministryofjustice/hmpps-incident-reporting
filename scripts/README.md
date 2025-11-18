# Import configuration from external sources


#### Import NOMIS configuration JSON files

Import the NOMIS JSON incident types file downloaded above with:

```shell
./scripts/updateNomisIncidentTypeConfigurations.ts  <nomisConfigFile>
```

This will create the TypeScript configuration for every known incident type in NOMIS including inactive ones.
NB: Make sure to check diffs for previous customisations (which do exist!) before checking into the git repository.


#### Download DPS & NOMIS configuration as CSV or JSON

Prints links to download configuration files:

```shell
./scripts/listDownloadLinks.ts <env>
```

#### Import DPS configuration JSON files

Import the DPS JSON files downloaded above with:

```shell
./scripts/importDpsConstants.ts <type> <file path>
```

This will create the typescript definitions for the latest constants and enumerations.
NB: Make sure to check diffs for previous customisations before checking into git repository.


