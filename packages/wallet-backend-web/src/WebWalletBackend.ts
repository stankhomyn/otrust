/* eslint-disable class-methods-use-this */
import { WalletBackend } from "@onomy/wallet";
import * as ethers from 'ethers';
import { WrappedEthereumWallet } from "./Chains/WrappedEthereumWallet";

import { KeplrCosmosWallet } from "./Chains/KeplrCosmosWallet";

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
    console.log('opts', options);
  }

  cosmos(chainId: string) {
    return new KeplrCosmosWallet(chainId);
  }

  ethereum() {
    return new WrappedEthereumWallet(this.ethereumProvider, this.ethereumSigner);
  }
}
