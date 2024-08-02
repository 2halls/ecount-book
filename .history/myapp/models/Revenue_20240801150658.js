class Revenue {
  constructor(salary, pension) {
    this.salary = salary;
    this.pension = pension;
  }

  getTotal() {
    return this.salary + this.pension;
  }
}

module.exports = Revenue;
