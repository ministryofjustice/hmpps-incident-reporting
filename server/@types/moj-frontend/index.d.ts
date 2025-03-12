declare module '@ministryofjustice/frontend' {
  function initAll(options?: { scope?: HTMLElement }): void
}

declare module '@ministryofjustice/frontend/moj/filters/all' {
  interface Filters {
    mojDate(
      moment: Date | string, // actual implementation uses moment.MomentInput
      type?: 'datetime' | 'shortdatetime' | 'date' | 'shortdate' | 'time',
    ): string
  }

  export default () => Filters
}
