const last = (get, set, args) => (action) => set(action(get(), ...args))

export default function apply(...middlewares) {
  middlewares.reverse()
  return (get, set, action, args) => {
    if (middlewares.length < 1) {
      return set(action(get(), ...args))
    }

    const chain = middlewares
      .map((middleware) => middleware(get, set))
      .reduce(
        (next, middleware) => middleware(next),
        last(get, set, args)
      )

    return chain(action)
  }
}
