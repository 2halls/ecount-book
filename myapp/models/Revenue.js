class Revenue {
  constructor() {
    this.salary = 0;
    this.pension = 0;
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
