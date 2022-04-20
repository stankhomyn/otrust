import { CosmosWallet, WalletBackend } from "@onomy/wallet";
import { ChainInfo } from "@keplr-wallet/types";
import { JsiRnCosmosWallet } from "./Chains/JsiRnCosmosWallet";

export class JsiRnWalletBackend extends WalletBackend {
  async generate(password?: string) {
    WalletCore.createWallet(256, password);
  }

  async loadMnemonic(mnemonic: string, password?: string) {
    WalletCore.importWalletFromMnemonic(mnemonic, password);
  }

  async loadFromStorage(passphrase?: string) {
    return WalletCore.loadWalletFromStorage(passphrase);
  }

  async cleanup() {
    WalletCore.cleanUp();
  }

  async delete() {
    WalletCore.deleteWallet();
  }

  cosmos(chainId: string, chainInfo?: ChainInfo): CosmosWallet {
    return new JsiRnCosmosWallet(chainId, chainInfo);
  }
}
