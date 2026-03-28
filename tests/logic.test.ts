import { describe, it, expect } from 'vitest'
import { calculateMileageStatus } from '../src/logic'

describe('calculateMileageStatus', () => {
  it('start date returns targetMileage=0, percentComplete=0, isOutOfRange=false', () => {
    const result = calculateMileageStatus(new Date('2026-02-16T12:00:00'))
    expect(result.targetMileage).toBe(0)
    expect(result.percentComplete).toBe(0)
    expect(result.isOutOfRange).toBe(false)
  })

  it('end date returns targetMileage=3000, percentComplete=100, isOutOfRange=false', () => {
    const result = calculateMileageStatus(new Date('2029-02-16T12:00:00'))
    expect(result.targetMileage).toBeCloseTo(3000, 5)
    expect(result.percentComplete).toBeCloseTo(100, 5)
    expect(result.isOutOfRange).toBe(false)
  })

  it('midpoint (~2027-08-16) returns targetMileage≈1500, percentComplete≈50', () => {
    const result = calculateMileageStatus(new Date('2027-08-16T12:00:00'))
    // Not the exact midpoint due to leap years — expect within ±20 mil of 1500
    expect(result.targetMileage).toBeGreaterThan(1480)
    expect(result.targetMileage).toBeLessThan(1520)
    expect(result.percentComplete).toBeGreaterThan(49)
    expect(result.percentComplete).toBeLessThan(51)
    expect(result.isOutOfRange).toBe(false)
  })

  it('before start date returns isOutOfRange=true', () => {
    const result = calculateMileageStatus(new Date('2026-01-01T12:00:00'))
    expect(result.isOutOfRange).toBe(true)
  })

  it('after end date returns isOutOfRange=true', () => {
    const result = calculateMileageStatus(new Date('2030-01-01T12:00:00'))
    expect(result.isOutOfRange).toBe(true)
  })

  it('milesPerWeekNeeded equals (3000 - targetMileage) / (daysLeft / 7)', () => {
    const result = calculateMileageStatus(new Date('2027-02-16T12:00:00'))
    const expected = (3000 - result.targetMileage) / (result.daysLeft / 7)
    expect(result.milesPerWeekNeeded).toBeCloseTo(expected, 10)
  })
})
