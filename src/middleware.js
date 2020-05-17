const final = (state, args) => (action) => action(state, ...args)

export default function apply(...middlewares) {
  middlewares.reverse()
  return (state, action, args) => {
    if (middlewares.length < 1) {
      return state
    }

    const chain = middlewares
      .map((middleware) => middleware(state))
      .reduce(
        (next, middleware) => middleware(next),
        final(state, args)
      )

    return chain(action)
  }
}
