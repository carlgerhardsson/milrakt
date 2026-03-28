import { calculateMileageStatus } from './logic'
import type { MileageStatus } from './types'

export function renderStatus(status: MileageStatus): void {
  // Implementation in Story 1.4
  console.log(status)
}

export function initUI(): void {
  const status = calculateMileageStatus(new Date())
  renderStatus(status)
}
