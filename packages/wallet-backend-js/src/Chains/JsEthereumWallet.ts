import { EthereumWallet } from "@onomy/wallet";
import { HdPath, Slip10RawIndex } from "@cosmjs/crypto";
import { JsWalletBackend } from "../JsWalletBackend";
import { Provider, TransactionRequest } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { getAddress } from "@ethersproject/address";
import { joinSignature, hexlify } from "@ethersproject/bytes";
import { hashMessage } from "@ethersproject/hash";
import { keccak256 } from "@ethersproject/keccak256";
import { Deferrable, resolveProperties } from "@ethersproject/properties";
import { SigningKey } from "@ethersproject/signing-key";
import { computeAddress, serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { BytesLike, Bytes } from "ethers";

export class JsEthereumWallet extends EthereumWallet {
  private backend: JsWalletBackend;
  private signer?: Signer;

  constructor(backend: JsWalletBackend) {
    super();
    this.backend = backend;
  }

  protected getPath(accountNumber = 0): HdPath {
    return [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(60),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.normal(0),
      Slip10RawIndex.normal(accountNumber)
    ];
  }

  async getSigner() {
    if (this.signer) return this.signer;
    const provider = await this.getProvider();
    const privKey = await this.backend.getPrivateKey(this.getPath());
    this.signer = new EthersWallet(privKey).connect(provider)
    return this.signer;
  }
}

class EthersWallet extends Signer {
  public provider?: Provider | undefined;
  private privKey: Uint8Array;

  constructor(privKey: Uint8Array, provider?: Provider) {
    super();
    this.privKey = privKey;
    this.provider = provider;
  }

  connect(provider: Provider): Signer {
    return new EthersWallet(this.privKey, provider);
  }

  async getAddress(): Promise<string> {
    const { publicKey } = new SigningKey(this.privKey);
    const address = computeAddress(publicKey);
    return address;
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return await this.signBytes(hashMessage(message));
  }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    const address = await this.getAddress();
    return resolveProperties(transaction).then(async (tx) => {
      if (tx.from != null) {
        if (getAddress(tx.from) !== address) {
          console.error("transaction from address mismatch", "transaction.from", transaction.from);
        }
        delete tx.from;
      }

      const signature = await this.signBytes(keccak256(serialize(<UnsignedTransaction>tx)));
      return serialize(<UnsignedTransaction>tx, signature);
    });
  }

  protected async signBytes(digest: BytesLike) {
    const signingKey = new SigningKey(this.privKey);
    const sig = signingKey.signDigest(digest);
    console.log("signing", hexlify(digest));
    console.log("sig", joinSignature(sig));
    return joinSignature(sig);
  }
}