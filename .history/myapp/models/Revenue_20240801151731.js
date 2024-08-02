class Revenue {
  constructor(salary, pension) {
    this.salary = salary;
    this.pension = pension;
  }

  getTotal() {
    return this.salary + this.pension;
  }

  add(keyword, amount) {
    if (this.hasOwnProperty(keyword)) {
      this[keyword] += amount;
    }
  }
}

module.exports = Revenue;
