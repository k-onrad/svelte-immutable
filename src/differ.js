function shallowEqual(a, b) {
  for (const i in a) if (a[i] !== b[i]) return false
  for (const i in b) if (!(i in a)) return false
  return true
}

function differs(a, b) {
  if (a !== b) {
    return true
  } else if (a && typeof a === "object") {
    return !shallowEqual(a, b)
  }
  return false
}

export default function diff(newState, oldState) {
  const diff = {}
  for (let key in newState) {
    const val = newState[key]
    if (differs(oldState[key], val)) {
      if (typeof val === "object" && typeof val.getMonth !== "function") {
        diff[key] = val.constructor === Array ? val.slice(0) : { ...val }
      } else {
        diff[key] = val
      }
    }
  }
  return { diff }
}
