import { writable } from 'svelte/store'

// use immutable to initialize a single store for a given part of the app (Single Source of Truth)
// update the store, creating subtrees if needed
// actions can destructure the state to change only what they need
export default function immutable(state = {}, middleware) {
  const { subscribe, update } = writable(state)

  const get = () => {
    let snapshot
    subscribe((state) => snapshot = state)()
    return snapshot
  }

  const set = (payload) => {
    update((state) => ({
      ...state,
      ...(typeof payload === 'function' ? payload(state) : payload)
    }))
  }

  // All changes are triggered through dispatch
  // dispatch is: (action, ...args) => action(state, ...args)
  // actions are: (state, ...args) => (state)
  // middlewares are: (state) => (next) => (action) => (state)
  const dispatch = (action, ...args) => {	
    typeof middleware === 'function' 
      ?	middleware(get, set, action, args) 
      : set(action(state, ...args))
  }

  return [{ subscribe, get }, dispatch]
}
