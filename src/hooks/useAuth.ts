import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)

  const signInWithGoogle = () =>
    signInWithPopup(auth, new GoogleAuthProvider())

  const logOut = () => signOut(auth)

  return { user, loading, signIn, signUp, signInWithGoogle, logOut }
}
