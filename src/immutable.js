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
  // middlewares are: (state) => (next, args) => ... => (state)
  const dispatch = (action, ...args) => {
    update(state => {
      const old = state

      if (typeof middleware === "function") {
        state = middleware(state, action, args)
        history.push({ new: state, old, diff: diff(state, old), action, middleware })
        return state
      }

      state = action(state, ...args)
      history.push({ new: state, old, diff: diff(state, old), action })
      return state
    })
  }

  return [{ subscribe }, dispatch, history, middleware]
}
