class MemoryDB {
  constructor() {
    this.database = new Map();
  }

  set(date, value) {
    if (!this.database.has(date)) {
      map.set(date, [value]);
    }
  }
}
