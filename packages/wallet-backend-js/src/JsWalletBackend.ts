import { CosmosWallet, EthereumWallet, WalletBackend } from "@onomy/wallet";
import { ChainInfo } from "@keplr-wallet/types";
import {
  Bip39,
  EnglishMnemonic,
  HdPath,
  Slip10,
  Slip10Curve,
} from "@cosmjs/crypto";
import { JsCosmosWallet } from "./Chains/JsCosmosWallet";
import { JsEthereumWallet } from "./Chains/JsEthereumWallet";

export class JsWalletBackend extends WalletBackend {
  private seed?: Uint8Array;

  async loadMnemonic(mnemonic: string, password?: string) {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(mnemonicChecked, password);
    this.seed = seed;
  }

  public async getPrivateKey(hdPath: HdPath) {
    if (!this.seed) throw new Error("No wallet loaded");
    const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, this.seed, hdPath);
    return privkey;
  }

  cosmos(chainId: string, chainInfo?: ChainInfo): CosmosWallet {
    return new JsCosmosWallet(this, chainId, chainInfo);
  }

  ethereum(): EthereumWallet {
    return new JsEthereumWallet(this);
  }
}
