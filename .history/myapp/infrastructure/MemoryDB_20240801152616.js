const Statement = require("../models/Statement");

class MemoryDB {
  constructor() {
    this.accounts = new Map();
    this.statements = new Map();
  }

  add(date, value) {
    const key = date.substring(0, 7);
    if (!this.accounts.has(key)) {
      this.accounts.set(key, []);
    }
    this.accounts.get(key).push(value);
  }

  fetch(year, month) {
    const key = year + "-" + month;
    if (!this.accounts.has(key)) {
      return [];
    }

    let data = this.accounts.get(key);
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return data;
  }
}
const db = new MemoryDB();
module.exports = db;
