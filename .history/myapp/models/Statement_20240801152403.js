const Expense = require("../models/Expense");
const Revenue = require("../models/Revenue");

class Statement {
  constructor() {
    this.expense = new Expense();
    this.revenue = new Revenue();
  }

  calculateTotal() {
    this.totalExpense = this.expense.getTotal();
    this.totalRevenue = this.revenue.getTotal();
  }
}

module.exports = Statement;
