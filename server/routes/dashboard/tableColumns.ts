import type { SortableTableColumns } from '../../utils/sortableTable'

type ColumnNames =
  | 'reportReference'
  | 'type'
  | 'incidentDateAndTime'
  | 'description'
  | 'reportedBy'
  | 'status'
  | 'establishment'

export type ColumnEntry = {
  column: ColumnNames
  escapedHtml: string
  classes: string
  unsortable?: true
}
const reportReferenceColumn: ColumnEntry = {
  column: 'reportReference',
  escapedHtml: 'Reference number',
  classes: 'govuk-table__cell--incident-ref',
}

const incidentTypeColumn: ColumnEntry = {
  column: 'type',
  escapedHtml: 'Type',
  classes: 'govuk-table__cell--incident-type',
}

const incidentDateAndTimeColumn: ColumnEntry = {
  column: 'incidentDateAndTime',
  escapedHtml: 'Incident date',
  classes: 'govuk-table__cell--incident-date',
}

const descriptionColumn: ColumnEntry = {
  column: 'description',
  escapedHtml: 'Description',
  classes: 'govuk-table__cell--description',
  unsortable: true,
}

const reportedByColumn: ColumnEntry = {
  column: 'reportedBy',
  escapedHtml: 'Reported By',
  classes: 'govuk-table__cell--reported-by',
}

const statusColumn: ColumnEntry = {
  column: 'status',
  escapedHtml: 'Status',
  classes: 'govuk-table__cell--status',
}

const establishmentColumn: ColumnEntry = {
  column: 'establishment',
  escapedHtml: 'Establishment',
  classes: 'govuk-table__cell--establishment',
}

export const singleCaseloadColumns: ColumnEntry[] = [
  reportReferenceColumn,
  incidentTypeColumn,
  incidentDateAndTimeColumn,
  descriptionColumn,
  reportedByColumn,
  statusColumn,
]

export const multiCaseloadColumns: ColumnEntry[] = [
  reportReferenceColumn,
  incidentTypeColumn,
  incidentDateAndTimeColumn,
  descriptionColumn,
  establishmentColumn,
  statusColumn,
]
