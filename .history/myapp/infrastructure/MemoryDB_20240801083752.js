class MemoryDB {
  constructor() {
    this.database = new Map();
  }

  add(date, value) {
    const key = this.makeTimestamp(date);
    if (!this.database.has(key)) {
      this.database.set(key, []);
    }
    this.database.get(key).push(value);
  }

  fetch(date) {
    const key = this.makeTimestamp(date);
    if (!this.database.has(key)) {
      return [];
    }

    return this.database.has(key);
  }

  makeTimestamp(date) {
    return date.substring(0, 7);
  }
}
const db = new MemoryDB();
module.exports = db;
