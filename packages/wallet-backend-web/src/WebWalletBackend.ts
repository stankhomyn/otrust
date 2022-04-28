/* eslint-disable class-methods-use-this */
import { Wallet, WalletBackend } from "@onomy/wallet";
import * as ethers from 'ethers';
import { WrappedEthereumWallet } from "./Chains/WrappedEthereumWallet";

import { KeplrCosmosWallet } from "./Chains/KeplrCosmosWallet";

export type ChainInfo = Parameters<InstanceType<typeof Wallet>['cosmos']>[1];

type Options = {
  ethereumProvider?: ethers.providers.Provider;
  ethereumSigner?: ethers.Signer;
}

export class WebWalletBackend extends WalletBackend {
  private ethereumProvider?: ethers.providers.Provider;
  private ethereumSigner?: ethers.Signer;

  constructor(options: Options) {
    super();
    this.ethereumProvider = options.ethereumProvider;
    this.ethereumSigner = options.ethereumSigner;
  }

  cosmos(chainId: string, chainInfo?: ChainInfo) {
    return new KeplrCosmosWallet(chainId, chainInfo);
  }

  ethereum() {
    return new WrappedEthereumWallet(this.ethereumProvider, this.ethereumSigner);
  }
}
