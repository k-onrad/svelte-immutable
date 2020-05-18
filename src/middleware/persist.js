const key_prefix = 'persist:'

function _() {}

function mapStateToStorage(get, config) {
  const state = get()
  return new Promise((resolve, reject) => {
    config.storage.setItem(
      key_prefix + config.key,
      JSON.stringify(state),
      err => (err ? reject(err) : resolve(state))
    )
  })
}

function mapStorageToState(get, config, cb = _) {
  const state = get()
  config.storage.getItem(key_prefix + config.key, (err, value) => {
    let _state = {}
    if (err) {
      cb(null, {})
    }
    try {
      _state = JSON.parse(value)
    } catch (err) {
      console.error('Error parsing state JSON')
    }
    cb(null, Object.assign({}, state, _state))
  })
}

class MemoryStorage {
  constructor() {
    this.store = {}
  }
  getItem(key, cb = _) {
    setTimeout(() => cb(null, this.store[key]))
  }
  setItem(key, item, cb = _) {
    setTimeout(() => {
      cb(null, (this.store[key] = item) && item)
    })
  }
  removeItem(key, cb = _) {
    const val = this.store[key]
    setTimeout(() => cb(null, delete this.store[key] && val))
  }
}

const persist = (config = { key: '[rc]', storage: new MemoryStorage() }, cb = _) => (get) => {
  mapStorageToState({}, config, (err, get) => {
    const state = get()
    if (err) {
      config.storage.removeItem(key_prefix + config.key, _err => {
        cb(_err, state)
      })
    } else {
      cb(err, state)
    }
  })

  // return middleware
  return (next) => (action) => {
    const r = next(action)
    if (r && typeof r.then === 'function') {
      return next(action).then(d => {
        return mapStateToStorage(get, config).then(() => Promise.resolve(d))
      })
    } else {
      return mapStateToStorage(get, config).then(() => Promise.resolve(r))
    }
  }
}

export default persist
