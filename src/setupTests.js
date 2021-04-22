class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
};

class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
    this.addEventListener = jest.fn();
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}

global.URL.createObjectURL = jest.fn();
global.Worker = Worker;
global.localStorage = new LocalStorageMock;