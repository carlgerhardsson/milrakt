import type { MileageStatus } from './types'

const START_DATE = new Date('2026-02-16T12:00:00')
const END_DATE = new Date('2029-02-16T12:00:00')
const TOTAL_MIL = 3000
const TOTAL_DAYS = (END_DATE.getTime() - START_DATE.getTime()) / 86400000

export function calculateMileageStatus(date: Date): MileageStatus {
  if (date < START_DATE || date > END_DATE) {
    return {
      targetMileage: 0,
      percentComplete: 0,
      milesPerWeekNeeded: 0,
      daysLeft: 0,
      isOutOfRange: true,
    }
  }

  const daysPassed = (date.getTime() - START_DATE.getTime()) / 86400000
  const daysLeft = TOTAL_DAYS - daysPassed
  const targetMileage = (daysPassed / TOTAL_DAYS) * TOTAL_MIL
  const percentComplete = (daysPassed / TOTAL_DAYS) * 100
  const weeksLeft = daysLeft / 7
  const milesPerWeekNeeded = (TOTAL_MIL - targetMileage) / weeksLeft

  return {
    targetMileage,
    percentComplete,
    milesPerWeekNeeded,
    daysLeft,
    isOutOfRange: false,
  }
}
