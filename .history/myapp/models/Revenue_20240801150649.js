class Revenue {
  constructor(salary, pension) {
    this.salary = salary;
    this.pension = pension;
  }

  getTotal() {
    return this.food + this.travel + this.transportation + this.housing + this.education + this.tax;
  }
}

module.exports = Revenue;
