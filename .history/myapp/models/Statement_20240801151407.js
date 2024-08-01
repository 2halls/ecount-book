const Expense = require("../models/Expense");
const Revenue = require("../models/Revenue");

class Statement {
  constructor() {
    this.expense = new Expense();
    this.totalExpense = this.expense.getTotal();
    this.revenue = new Revenue();
    this.totalRevenue = this.revenue.getTotal();
  }
}

module.exports = Statement;
