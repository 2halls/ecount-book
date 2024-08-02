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
    this.accounts.set("2017-04", [
      new Account("2017-04-17", "23:07", "카카오뱅크", "food", 3000, "김밥 냠냠", "expension"),
      new Account("2017-04-27", "23:07", "토스뱅크", "transportation", 1500, "교통비 냠냠", "expension"),
      new Account("2017-04-17", "11:07", "카카오뱅크", "travel", 10000, "여행 냠냠", "expension"),
      new Account("2017-04-03", "23:07", "국민은행", "salary", 1000000, "월급 냠냠", "revenue"),
      new Account("2017-04-01", "13:07", "카카오뱅크", "pension", 100000, "연금 냠냠", "revenue"),
      new Account("2017-04-01", "22:07", "신한은행", "housing", 500000, "월세 냠냠", "expension"),
    ]);

    let statement1 = new Statement();
    statement1.add("food", 3000, "expension");
    statement1.add("transportation", 1500, "expension");
    statement1.add("travel", 10000, "expension");
    statement1.add("salary", 1000000, "revenue");
    statement1.add("pension", 100000, "revenue");
    statement1.add("housing", 500000, "expension");
    this.statements.set("2017-04", statement1);

    this.accounts.set("2017-03", [
      new Account("2017-03-17", "23:07", "카카오뱅크", "food", 3000, "김밥 냠냠", "expension"),
      new Account("2017-03-27", "23:07", "토스뱅크", "transportation", 1500, "교통비 냠냠", "expension"),
      new Account("2017-03-17", "11:07", "카카오뱅크", "travel", 10000, "여행 냠냠", "expension"),
      new Account("2017-03-03", "23:07", "국민은행", "salary", 1000000, "월급 냠냠", "revenue"),
    ]);
  }
}
const db = new MemoryDB();
module.exports = db;
