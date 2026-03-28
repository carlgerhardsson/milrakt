import { calculateMileageStatus } from './logic'
import type { MileageStatus } from './types'

function barColor(pct: number): string {
  if (pct < 33) return 'var(--accent)'
  if (pct < 66) return 'var(--green)'
  return 'var(--orange)'
}

export function renderStatus(status: MileageStatus): void {
  const el = document.getElementById('result')
  if (!el) return

  if (status.isOutOfRange) {
    el.innerHTML = '' // Story 1.5 fills this
    return
  }

  const color = barColor(status.percentComplete)

  el.innerHTML = `
    <div class="card">
      <div class="big-label">Du borde ha kört</div>
      <div class="big-number" style="color:${color}">${status.targetMileage.toFixed(1)}</div>
      <div class="big-label">mil av 3 000</div>

      <div class="bar-wrap">
        <div class="bar-fill" style="width:${status.percentComplete.toFixed(1)}%;background:${color}"></div>
      </div>
      <div class="bar-labels">
        <span>start</span>
        <span>${status.percentComplete.toFixed(1)}% av avtalet</span>
        <span>slut</span>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-val">${status.milesPerWeekNeeded.toFixed(1)}</div>
          <div class="stat-lbl">Mil/vecka kvar</div>
        </div>
        <div class="stat">
          <div class="stat-val">${Math.round(status.daysLeft)}</div>
          <div class="stat-lbl">Dagar kvar</div>
        </div>
      </div>
    </div>
    <p class="timeline-label">Avtalet löper ut 16 feb 2029</p>
  `
}

export function initUI(): void {
  const picker = document.getElementById('datePicker') as HTMLInputElement | null
  const todayBtn = document.querySelector<HTMLButtonElement>('.today-btn')

  function update(dateStr: string): void {
    const date = new Date(dateStr + 'T12:00:00')
    renderStatus(calculateMileageStatus(date))
  }

  function setToday(): void {
    const iso = new Date().toISOString().split('T')[0]
    if (picker) picker.value = iso
    update(iso)
  }

  picker?.addEventListener('change', () => update(picker.value))
  todayBtn?.addEventListener('click', setToday)

  setToday()
}
