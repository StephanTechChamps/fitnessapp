import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Workout } from '../types'
import { useAuth } from './useAuth'

export function useWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(false)

  const workoutsRef = user ? collection(db, 'users', user.uid, 'workouts') : null

  const saveWorkout = async (workout: Omit<Workout, 'id'>) => {
    if (!workoutsRef) return null
    const ref = await addDoc(workoutsRef, { ...workout, createdAt: serverTimestamp() })
    return ref.id
  }

  const updateWorkout = async (id: string, workout: Omit<Workout, 'id'>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'workouts', id), { ...workout })
  }

  const fetchWorkouts = useCallback(async (count = 50) => {
    if (!workoutsRef) return
    setLoading(true)
    try {
      const q = query(workoutsRef, orderBy('createdAt', 'desc'), limit(count))
      const snap = await getDocs(q)
      setWorkouts(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name,
            date: data.date,
            durationMinutes: data.durationMinutes,
            exercises: data.exercises ?? [],
            createdAt: data.createdAt?.seconds,
          } as Workout
        })
      )
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchWorkouts()
  }, [fetchWorkouts])

  return { workouts, loading, saveWorkout, updateWorkout, fetchWorkouts }
}
