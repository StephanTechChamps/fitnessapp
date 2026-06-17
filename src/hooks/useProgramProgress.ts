import { useState } from 'react'
import { getProgram } from '../data/programs'

interface CurrentProgress {
  programId: string
  programName: string
  phaseId: string
  week: number
  dayNum: number
  focus: string
}

const CURRENT_KEY = 'programCurrent_v3'
const COMPLETED_KEY = 'programCompletedSessions_v3'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function sessionKey(programId: string, phaseId: string, week: number, day: number) {
  return `${programId}|${phaseId}|${week}|${day}`
}

export function useProgramProgress() {
  const [progress, setProgress] = useState<CurrentProgress | null>(() => load(CURRENT_KEY, null))

  function saveSession(p: CurrentProgress) {
    setProgress(p)
    save(CURRENT_KEY, p)
  }

  function clear() {
    setProgress(null)
    try { localStorage.removeItem(CURRENT_KEY) } catch {}
  }

  return { progress, saveSession, clear }
}

export function useCompletedSessions() {
  const [keys, setKeys] = useState<string[]>(() => load(COMPLETED_KEY, []))

  function markComplete(programId: string, phaseId: string, week: number, day: number) {
    const k = sessionKey(programId, phaseId, week, day)
    if (keys.includes(k)) return
    const next = [...keys, k]
    setKeys(next)
    save(COMPLETED_KEY, next)
  }

  function isComplete(programId: string, phaseId: string, week: number, day: number) {
    return keys.includes(sessionKey(programId, phaseId, week, day))
  }

  function completedFor(programId: string) {
    return keys.filter((k) => k.startsWith(`${programId}|`)).length
  }

  return { markComplete, isComplete, completedCount: keys.length, completedFor }
}

// Next session in schedule order. For phases with a fixed week list, walk
// day → next week → next phase. For ongoing phases (weeks === null), loop to
// week+1 day 1 indefinitely.
export function getNextSession(programId: string, phaseId: string, week: number, day: number) {
  const program = getProgram(programId)
  const phase = program?.phases.find((p) => p.id === phaseId)
  if (!program || !phase) return null

  const dayIdx = phase.days.findIndex((d) => d.day === day)
  if (dayIdx >= 0 && dayIdx < phase.days.length - 1) {
    return { programId, phaseId, week, dayNum: phase.days[dayIdx + 1].day }
  }

  // Ongoing weekly cycle — repeat forever.
  if (phase.weeks === null) {
    return { programId, phaseId, week: week + 1, dayNum: phase.days[0].day }
  }

  const weekIdx = phase.weeks.indexOf(week)
  if (weekIdx >= 0 && weekIdx < phase.weeks.length - 1) {
    return { programId, phaseId, week: phase.weeks[weekIdx + 1], dayNum: phase.days[0].day }
  }

  const phaseIdx = program.phases.findIndex((p) => p.id === phaseId)
  const nextPhase = program.phases[phaseIdx + 1]
  if (nextPhase) {
    const w = nextPhase.weeks ? nextPhase.weeks[0] : 1
    return { programId, phaseId: nextPhase.id, week: w, dayNum: nextPhase.days[0].day }
  }

  return null
}

// Finite session total for a program, or null if it runs indefinitely.
export function totalSessions(programId: string): number | null {
  const program = getProgram(programId)
  if (!program) return 0
  let total = 0
  for (const p of program.phases) {
    if (p.weeks === null) return null
    total += p.weeks.length * p.days.length
  }
  return total
}
