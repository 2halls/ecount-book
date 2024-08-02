const Expense = require("../models/Expense");
const Revenue = require("../models/Revenue");

class Statement {
  constructor() {
    this.expense = new Expense();
    this.revenue = new Revenue();
    this.totalExpense = 0;
    this.totalRevenue = 0;
  }

  calculateTotal() {
    this.totalExpense = this.expense.getTotal();
    this.totalRevenue = this.revenue.getTotal();
  }

  add(keyword, amount, transactionType) {
    if (transactionType === "revenue") {
      this.revenue.add(keyword, amount);
    } else {
      this.expense.add(keyword, amount);
    }
  }

  getTotal() {
    this.calculateTotal();
    return {
      totalExpense,
      totalRevenue,
    };
  }
}

module.exports = Statement;
