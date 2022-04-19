import { EthereumWallet } from "@onomy/wallet";
import { HdPath, Slip10RawIndex } from "@cosmjs/crypto";
import { Wallet } from "ethers";
import { JsWalletBackend } from "../JsWalletBackend";

export class JsEthereumWallet extends EthereumWallet {
  private backend: JsWalletBackend;

  constructor(backend: JsWalletBackend) {
    super();
    this.backend = backend;
  }

  protected getPath(accountNumber = 0): HdPath {
    return [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(60),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.normal(accountNumber)
    ];
  }

  async getSigner() {
    const privKey = await this.backend.getPrivateKey(this.getPath());
    return new Wallet(privKey)
  }
}