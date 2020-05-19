import diff from '../utils/differ'

export const log = []

// (config) => (state) => (middleware)
const logger = () => (get) => {
  // return an middleware
  return (next) => (action) => {
    const previous = get()
    const r = next(action)
    const current = get()

    prinf(previous, action.name, current)
    log.push({ current, previous, action, diff: diff(current, previous) })

    return r
  }
}

const prinf = (previous, action, current) => {
  console.group(action, '@' + new Date().toISOString())
  console.log('%cprev state', 'color:#9E9E9E', previous)
  console.log('%caction', 'color:#2196F3', action)
  console.log('%cnext state', 'color:#4CAF50', current)
  console.groupEnd()
}

export default logger
