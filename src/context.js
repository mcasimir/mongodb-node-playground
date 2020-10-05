export class Context {
  constructor(client) {
    this.client = client;
  }

  db = (name) => {
    return this.client.db(name);
  }
}
