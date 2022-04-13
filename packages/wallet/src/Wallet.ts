import { ChainInfo } from "@keplr-wallet/types";
import { WalletBackend } from "./WalletBackend";

export class Wallet<T extends WalletBackend> {
  private backend: T;

  constructor(backend: T) {
    this.backend = backend;
  }

  generate() {
    return this.backend.generate();
  }

  loadMnemonic(mnemonic: string) {
    return this.backend.loadMnemonic(mnemonic);
  }

  cosmos(chainId: string, chainInfo?: ChainInfo) {
    return this.backend.cosmos(chainId, chainInfo);
  }

  ethereum() {
    return this.backend.ethereum();
  }
}
