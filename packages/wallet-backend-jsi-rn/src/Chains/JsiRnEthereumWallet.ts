import { EthereumWallet } from "@onomy/wallet";
import { Provider, TransactionRequest } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { getAddress } from "@ethersproject/address";
import { hexlify } from "@ethersproject/bytes";
import { hashMessage } from "@ethersproject/hash";
import { keccak256 } from "@ethersproject/keccak256";
import { Deferrable, resolveProperties } from "@ethersproject/properties";
import { computeAddress, serialize, UnsignedTransaction } from "@ethersproject/transactions";
import { BytesLike, Bytes } from "ethers";

export class JsiRnEthereumWallet extends EthereumWallet {
  private signer?: Signer;

  async getSigner() {
    if (this.signer) return this.signer;
    const provider = await this.getProvider();
    this.signer = new EthersWallet(provider)
    return this.signer;
  }
}

class EthersWallet extends Signer {
  public provider?: Provider | undefined;

  constructor(provider?: Provider) {
    super();
    this.provider = provider;
  }

  connect(provider: Provider): Signer {
    return new EthersWallet(provider);
  }

  async getAddress(): Promise<string> {
    const { publicKey } = WalletCore.getAccount("cosmos", this.getPath());
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

  protected getPath(accountNumber = 0): string {
    return `m/44'/60'/0'/0/${accountNumber}`;
  }

  protected async signBytes(digest: BytesLike) {
    const hex = hexlify(digest).slice(2); // Remove unwanted 0x
    const sigStr = WalletCore.signData("ethereum", hex, this.getPath());
    return `0x${sigStr}`;
  }
}