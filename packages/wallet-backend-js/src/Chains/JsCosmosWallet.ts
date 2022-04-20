import { CosmosWallet } from "@onomy/wallet";
import { ChainInfo } from "@keplr-wallet/types";
// eslint-disable-next-line import/no-cycle
import { JsWalletBackend } from "../JsWalletBackend";
import { rawSecp256k1PubkeyToRawAddress } from "@cosmjs/amino";
import { HdPath, Secp256k1, sha256, Slip10RawIndex } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { AccountData } from "@cosmjs/proto-signing";

export class JsCosmosWallet extends CosmosWallet {
  private _pubkey?: Uint8Array;
  private _privkey?: Uint8Array;
  private prefix: string = "onomy"; // TODO

  private backend: JsWalletBackend;
  // TODO

  constructor(backend: JsWalletBackend, chainId: string, chainInfo?: ChainInfo) {
    super(chainId, chainInfo);
    this.backend = backend;
  }

  protected getPath(accountNumber = 0): HdPath {
    console.log({ sha256, Slip10RawIndex });
    return [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(118),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.normal(0),
      Slip10RawIndex.normal(accountNumber)
    ];
  } 

  public async connect(): Promise<void> {
    if (this.isConnected()) return;
    this._privkey = await this.backend.getPrivateKey(this.getPath());
    const { pubkey } = await Secp256k1.makeKeypair(this._privkey);
    console.log('raw pubkey', toHexString(pubkey));
    this._pubkey = Secp256k1.compressPubkey(pubkey);
  }

  public isConnected(): boolean {
    return !!this._pubkey;
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    await this.connect();
    const res: AccountData[] = [
      {
        algo: "secp256k1",
        address: this.address,
        pubkey: this.pubkey!,
      }
    ];
    console.log('accounts', res);
    return res;
  }

  protected async signBytes(signerAddress: string, signBytes: Uint8Array): Promise<Uint8Array> {
    if (signerAddress !== this.address) throw new Error("TODO: specific error");
    if (!this.privkey || !this.pubkey) throw new Error("TODO: specific error");
    const hashedMessage = sha256(signBytes);
    console.log('to sign', toHexString(hashedMessage));
    const signature = await Secp256k1.createSignature(hashedMessage, this.privkey);
    const r = signature.r(32);
    const s = signature.s(32);
    const signatureBytes = new Uint8Array([...r, ...s]);
    console.log('signature', toHexString(signatureBytes));
    return signatureBytes;
  }

  private get address(): string {
    if (!this.pubkey) throw new Error('Error getting pubkey');
    return Bech32.encode(this.prefix, rawSecp256k1PubkeyToRawAddress(this.pubkey))
  }

  private get pubkey() {
    if (this._pubkey) return this._pubkey;
  }

  private get privkey() {
    if (this._privkey) return this._privkey;
  }
}

function toHexString(bytes: Uint8Array) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
