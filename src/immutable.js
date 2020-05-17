import { writable } from 'svelte/store'
import diff from './differ.js'

// use immutable to initialize a single store for a given part of the app (Single Source of Truth)
// update the store, creating subtrees if needed
// actions can destructure the state to change only what they need
export default function immutable(state = {}, middleware) {
  const { subscribe, update } = writable(state)

  const history = []

  // All changes are triggered through dispatch
  // dispatch is: (action, ...args) => action(state, ...args)
  // actions are: (state, ...args) => (state)
  // middlewares are: (state) => (next) => (action) => (state)
  const dispatch = (action, ...args) => {
    update((previous) => {
      const current = typeof middleware === 'function' ?
        middleware(previous, action, args) :
        action(previous, ...args)

      history.push({ current, previous, diff: diff(current, previous), action })

      return current
    })
  }

  return [{ subscribe }, dispatch, history]
}
