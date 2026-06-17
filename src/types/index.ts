export interface WorkoutSet {
  reps: number
  weightKg: number
  completed: boolean
}

export interface WorkoutExercise {
  exerciseId: string
  name: string
  category: string
  imageUrl: string | null
  sets: WorkoutSet[]
}

export interface Workout {
  id?: string
  name: string
  date: string
  durationMinutes?: number
  exercises: WorkoutExercise[]
  createdAt?: number
}

export interface WgerExercise {
  id: number
  name: string
  category: string
  imageUrl: string | null
}
