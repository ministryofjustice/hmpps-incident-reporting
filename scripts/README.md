# Import configuration from external sources

#### Download DPS configuration as JSON

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

