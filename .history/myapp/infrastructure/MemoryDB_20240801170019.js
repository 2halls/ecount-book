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
      this.statements.set(key, new Statement());
    }
    this.accounts.get(key).push(value);
    this.statements.get(key).add(value.category, value.amount, value.transactionType);
  }

  fetchAccounts(year, month, sort, order) {
    const key = year + "-" + month;
    if (!this.accounts.has(key)) {
      return [];
    }

    let data = this.accounts.get(key);
    if (sort !== undefined) {
      if (order === "desc") {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        return data;
      } else {
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }

    return data;
  }

  fetchStatement(date) {
    const key = date.substring(0, 7);
    if (!this.statements.has(key)) {
      return null;
    }
    this.statements.get(key).updateTotal();
    return this.statements.get(key);
  }
}
const db = new MemoryDB();
module.exports = db;