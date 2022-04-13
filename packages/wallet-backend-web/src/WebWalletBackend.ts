/* eslint-disable class-methods-use-this */
import { CosmosWallet, WalletBackend } from "@onomy/wallet";
import { KeplrCosmosWallet } from "./Chains/KeplrCosmosWallet";

export class WebWalletBackend extends WalletBackend {
  cosmos(chainId: string): CosmosWallet {
    return new KeplrCosmosWallet(chainId);
  }
}
