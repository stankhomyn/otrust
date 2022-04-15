import { CosmosWallet } from "@onomy/wallet";
// eslint-disable-next-line import/no-cycle
import { rawSecp256k1PubkeyToRawAddress } from "@cosmjs/amino";
import { Secp256k1, sha256 } from "@cosmjs/crypto";
import { Bech32 } from "@cosmjs/encoding";
import { AccountData } from "@cosmjs/proto-signing";

export class JsiRnCosmosWallet extends CosmosWallet {
  private _pubkey?: Uint8Array;
  private prefix: string = "onomy"; // TODO make configurable

  protected getPath(accountNumber = 0): string {
    return `m/44'/118'/0'/0/${accountNumber}`;
  } 

  public async connect(): Promise<void> {
    if (this.isConnected()) return;
    const { publicKey } = WalletCore.getAccount("cosmos", this.getPath());
    this._pubkey = Secp256k1.compressPubkey(fromHexString(publicKey));
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
    const hashedMessage = sha256(signBytes);
    const payload = toHexString(hashedMessage);
    console.log('payload', payload);
    const sigStr = WalletCore.signData("cosmos", payload, this.getPath());
    console.log('signature', sigStr);
    return fromHexString(sigStr.slice(0, sigStr.length - 2)); // Not sure what these 2 extra bytes are for
  }

  private get address(): string {
    if (!this.pubkey) throw new Error('Error getting pubkey');
    return Bech32.encode(this.prefix, rawSecp256k1PubkeyToRawAddress(this.pubkey))
  }

  private get pubkey() {
    if (this._pubkey) return this._pubkey;
  }
}


// https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript/50868276#50868276
function fromHexString(hexString: string) {
  return new Uint8Array(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []);
}

function toHexString(bytes: Uint8Array) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
