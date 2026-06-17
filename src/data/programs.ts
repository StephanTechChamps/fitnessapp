import { BUFF_DUDES } from './buffDudes'
import { PHUL } from './phul'
import type { Program } from './buffDudes'

export const PROGRAMS: Program[] = [BUFF_DUDES, PHUL]

export function getProgram(id?: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id)
}

export type { Program } from './buffDudes'
