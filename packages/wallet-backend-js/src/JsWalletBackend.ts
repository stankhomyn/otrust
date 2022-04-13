import { CosmosWallet, WalletBackend } from "@onomy/wallet";
import { ChainInfo } from "@keplr-wallet/types";
import {
  Bip39,
  EnglishMnemonic,
  HdPath,
  pathToString,
  Random,
  Secp256k1,
  Secp256k1Keypair,
  sha256,
  Slip10,
  Slip10Curve,
  stringToPath,
} from "@cosmjs/crypto";
import { JsCosmosWallet } from "./Chains/JsCosmosWallet";

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
}
