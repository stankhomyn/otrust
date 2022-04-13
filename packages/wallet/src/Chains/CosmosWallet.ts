/* eslint-disable class-methods-use-this */
import { AccountData, encodeSecp256k1Signature } from "@cosmjs/amino";
import {
  makeSignDoc,
  makeSignBytes,
  DirectSignResponse,
  OfflineDirectSigner,
} from "@cosmjs/proto-signing";
import { ChainInfo } from "@keplr-wallet/types";
import { WalletErrors } from "../WalletErrors";

type SignDoc = ReturnType<typeof makeSignDoc>;

export abstract class CosmosWallet {
  protected chainId: string;
  protected chainInfo?: ChainInfo;

  constructor(chainId: string, chainInfo?: ChainInfo) {
    this.chainId = chainId;
    this.chainInfo = chainInfo;
  }

  public async connect() {
    // optional
  }

  public isConnected() {
    return false;
  }

  public getAccounts(): Promise<readonly AccountData[]> {
    throw new WalletErrors.NotSupported(
      "CosmosWallet.getAccounts not supported"
    );
  }

  protected signBytes(
    _signerAddress: string,
    _bytes: Uint8Array
  ): Promise<Uint8Array> {
    throw new WalletErrors.NotSupported("CosmosWallet.signBytes not supported");
  }

  public async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    const { pubkey = null } =
      (await this.getAccounts()).find(
        ({ address }) => address === signerAddress
      ) || {};
    if (!pubkey) throw new Error(`Can't find ${signerAddress}`);
    const signBytes = makeSignBytes(signDoc);
    const sig = await this.signBytes(signerAddress, signBytes);
    const signature = encodeSecp256k1Signature(pubkey, sig);
    return {
      signed: signDoc,
      signature,
    };
  }

  getSigner(): OfflineDirectSigner {
    return this;
  }

  signTx() {
    throw new WalletErrors.NotSupported("CosmosWallet.signTx not supported");
  }
}
