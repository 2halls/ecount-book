class Statement {
  constructor(expense, revenue) {
    this.expense = expense;
    this.revenue = revenue;
  }
}

class Expense {
  constructor(food, travel, transportation, housing, education, tax, total) {
    this.food = food;
    this.travel = travel;
    this.transportation = transportation;
    this.housing = housing;
    this.education = education;
    this.tax = tax;
  }
}

class Revenue {
  constructor(expense, revenue) {
    this.expense = expense;
    this.revenue = revenue;
  }
}

module.exports = Statement;
