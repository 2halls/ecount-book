class Account {
  constructor(date, time, bank, category, amount, content, transactionType) {
    this.date = date;
    this.time = time;
    this.bank = bank;
    this.category = category;
    this.amount = amount;
    this.content = content;
    this.transactionType = transactionType;
  }

  getDate() {
    return this.date;
  }
}

module.exports = Account;
