const formatters = {
  precise: new Intl.NumberFormat('it-IT', {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  rounded: new Intl.NumberFormat('it-IT', {
    useGrouping: true,
    maximumFractionDigits: 0,
  }),
}

export type MoneyFormat = 'precise' | 'rounded'

export function formatMoney(value: number, mode: MoneyFormat = 'precise'): string {
  return `€${formatters[mode].format(value)}`
}
