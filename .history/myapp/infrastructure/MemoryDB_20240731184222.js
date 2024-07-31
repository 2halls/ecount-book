class MemoryDB {
  constructor() {
    this.database = new Map();
  }

  add(timestamp, value) {
    if (!this.database.has(timestamp)) {
      this.database.set(timestamp, []);
    }
    this.database.get(timestamp).push(value);
  }

  fetch(timestamp) {
    if (!this.database.has(timestamp)) {
      return [];
    }

    return this.database.has(timestamp);
  }
}
const db = new MemoryDB();
module.exports = db;
