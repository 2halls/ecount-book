class Expense {
  constructor() {
    this.food = 0;
    this.travel = 0;
    this.transportation = 0;
    this.housing = 0;
    this.education = 0;
    this.tax = 0;
  }

  getTotal() {
    return this.food + this.travel + this.transportation + this.housing + this.education + this.tax;
  }

  add(keyword, amount) {
    if (this.hasOwnProperty(keyword)) {
      this[keyword] += value;
    }
  }
}

module.exports = Expense;
