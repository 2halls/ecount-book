class MemoryDB {
  constructor() {
    this.database = new Map();
  }

  add(date, value) {
    if (!this.database.has(date)) {
      this.database.set(date, []);
      throw new Error("ASSADSAD");
    }
    this.database.get(date).push(value);
  }

  fetch(date) {
    if (!this.database.has(date)) {
      return [];
    }

    return this.database.has(date);
  }
}
const db = new MemoryDB();
module.exports = db;
