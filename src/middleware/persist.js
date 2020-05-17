const key_prefix = 'persist:'

function _() {}

function mapStateToStorage(state, config) {
  return new Promise((resolve, reject) => {
    config.storage.setItem(
      key_prefix + config.key,
      JSON.stringify(state),
      err => (err ? reject(err) : resolve(state))
    )
  })
}

function mapStorageToState(state, config, cb = _) {
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

const persist = (config = { key: '[rc]', storage: new MemoryStorage() }, cb = _) => (state) => {
  mapStorageToState({}, config, (err, state) => {
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
        return mapStateToStorage(state, config).then(() => Promise.resolve(d))
      })
    } else {
      return mapStateToStorage(state, config).then(() => Promise.resolve(r))
    }
  }
}

export default persist
