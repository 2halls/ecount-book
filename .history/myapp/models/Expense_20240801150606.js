class Expense {
  constructor(food, travel, transportation, housing, education, tax) {
    this.food = food;
    this.travel = travel;
    this.transportation = transportation;
    this.housing = housing;
    this.education = education;
    this.tax = tax;
  }

  getTotal() {
    return this.food + this.travel + this.transportation + this.housing + this.education + this.tax;
  }
}

module.exports = Expense;
