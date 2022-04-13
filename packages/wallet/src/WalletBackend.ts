/* eslint-disable class-methods-use-this */
import { ChainInfo } from "@keplr-wallet/types";
import { CosmosWallet } from "./Chains/CosmosWallet";
import { EthereumWallet } from "./Chains/EthereumWallet";
import { WalletErrors } from "./WalletErrors";

export abstract class WalletBackend {
  async generate() {
    throw new WalletErrors.NotSupported("Wallet.generate not supported");
  }

  async loadMnemonic(_mnemonic: string, _password?: string) {
    throw new WalletErrors.NotSupported("Wallet.loadMnemonic not supported");
  }

  async loadFromStorage(password?: string) {
    return false;
  }

  async cleanup() {
    return;
  }

  async delete() {
    return;
  }

  cosmos(_chainId: string, _chainInfo?: ChainInfo): CosmosWallet {
    throw new WalletErrors.NotSupported("Cosmos wallet not supported");
  }

  ethereum(): EthereumWallet {
    throw new WalletErrors.NotSupported("Ethereum wallet not supported");
  }
}
