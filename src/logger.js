const prinf = (old, action, current) => {
  console.group(action, "@" + new Date().toISOString())
  console.log("%cprev state", "color:#9E9E9E", old)
  console.log("%caction", "color:#2196F3", action)
  console.log("%cnext state", "color:#4CAF50", current)
  console.groupEnd()
}

export default function logger(state) {
  // return an middleware
  return (next, args) => (action) => {
    const old = state
    const r = next(action, ...args)

    if (r && typeof r.then === "function") {
      return next(action, ...args).then(
        d => prinf(old, action.name, r) && Promise.resolve(d)
      )
    } else {
      prinf(old, action.name, r)
      return r
    }
  }
}
