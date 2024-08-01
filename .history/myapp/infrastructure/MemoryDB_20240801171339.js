const Statement = require("../models/Statement");
const Account = require("../models/Account");

class MemoryDB {
  constructor() {
    this.accounts = new Map();
    this.statements = new Map();
    this.init();
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
        data.sort((a, b) => new Date(b.date + "T" + b.time) - new Date(a.date + "T" + b.time));
        return data;
      } else {
        return data.sort((a, b) => new Date(a.date + "T" + b.time) - new Date(b.date + "T" + b.time));
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

  init() {
    date, time, bank, category, amount, content, transactionType;
    new Account("2017-04-17", "23:07", "카카오뱅크", "transportation", 3000, "김밥 냠냠", "expension");
  }
}
const db = new MemoryDB();
module.exports = db;
