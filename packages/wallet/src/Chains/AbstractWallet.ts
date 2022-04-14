export abstract class AbstractWallet {
  public async connect() {
    // optional
  }

  public isAvailable() {
    return false;
  }

  public isConnected() {
    return false;
  }
}