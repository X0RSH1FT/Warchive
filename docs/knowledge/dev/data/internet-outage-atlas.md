# Internet Outage Atlas: owner map

This note records the project boundaries and source semantics for the
Internet Outage Atlas. It is not a deployment guide or a record of private
host inventory.

## Repository ownership

- **Airflow** owns the IODA events/alerts collector, scheduling, configuration,
  artifacts, tests, and runtime connection contract.
- **Data-Space** owns the PostgreSQL schema, migrations, and SQL contracts.
- **Bit-Control** owns database host operations, roles, access, and migration
  execution.
- **Grafana** owns datasource mapping and dashboard exports.
- **Home Assistant** is not a collector, storage, or reporting dependency.
- **Warchive** holds this general owner map only; it is not the source of truth
  for project implementation or private deployment inventory.

## IODA interpretation

IODA processed events and underlying alerts are separate source record types.
Preserve their original records, source identifiers, source times, signal or
method fields, and source-provided severity. Missing data or a filtered record
is not proof of recovery, and source severity is not a percentage of users
disconnected.

The selected test subject was Iceland (`country:IS`). A bounded seven-day
read-only request on 2026-11-16 returned HTTP 200 with empty `data` arrays for
both events and alerts. That single filtered result does not show that Iceland
had no outage and does not establish collector coverage or publication lag.

The implementation and deployment boundary are documented in the owning
repositories: [Airflow](https://github.com/X0RSH1FT/Airflow/blob/feature/internet-outage-atlas-ioda/docs/internet-outage-atlas.md),
[Data-Space](https://github.com/X0RSH1FT/data-space/blob/feature/internet-outage-atlas-ioda/database/internet-outage-atlas/README.md),
[Bit-Control](https://github.com/X0RSH1FT/Bit-Control/blob/feature/internet-outage-atlas-ioda/docs/linux/internet-outage-atlas.md),
[Grafana](https://github.com/X0RSH1FT/Grafana/blob/feature/internet-outage-atlas-ioda/datasources/README.md),
and [Home Assistant](https://github.com/X0RSH1FT/Home-Assistant/blob/feature/internet-outage-atlas-ioda/docs/internet-outage-atlas.md).
