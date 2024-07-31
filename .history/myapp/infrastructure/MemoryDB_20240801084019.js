class MemoryDB {
  constructor() {
    this.database = new Map();
  }

  add(date, value) {
    const key = date.substring(0, 7);
    if (!this.database.has(key)) {
      this.database.set(key, []);
    }
    this.database.get(key).push(value);
  }

  fetch(year, month) {
    const key = year + "-" + month;
    if (!this.database.has(key)) {
      return [];
    }

    return this.database.has(key);
  }
}
const db = new MemoryDB();
module.exports = db;
