/* eslint-disable class-methods-use-this */
import { CosmosWallet, WalletErrors } from "@onomy/wallet";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { DirectSignResponse, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

export class KeplrCosmosWallet extends CosmosWallet {
  private keplrConnected = false;

  public isAvailable(): boolean {
    const keplrWindow = window as KeplrWindow;
    return !!keplrWindow.keplr;
  }

  public isConnected(): boolean {
    return this.keplrConnected;
  }

  async getAccounts() {
    try {
      if (!this.isConnected()) return [];
      const keplr = this.getKeplr();
      const signer = await keplr.getOfflineSigner(this.chainId);
      const accounts = await signer.getAccounts();
      return accounts;
    } catch { // TODO specifically catch keplr missing
      return [];
    }
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    const keplr = this.getKeplr();
    const signer = await keplr.getOfflineSigner(this.chainId);
    const response = await signer.signDirect(signerAddress, signDoc);
    return response;
  }

  async connect() {
    // This weirdness is necessary to work around how keplr forgets chain suggest prompt after unlock
    try {
      const keplr = this.getKeplr();
      await keplr.enable(this.chainId);
      await this.connectActual();
    } catch (e) {
      if ((e as Error)?.message.indexOf('no chain info')) {
        setTimeout(this.connectActual, 1000);
      }
    }
  }

  protected async connectActual() {
    if (this.keplrConnected) return;

    try {
      const keplr = this.getKeplr();
      if (this.chainInfo) await keplr.experimentalSuggestChain(this.chainInfo);
      await keplr.enable(this.chainId);
      this.keplrConnected = true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('keplr error', e);
    }
  }

  protected getKeplr() {
    const keplrWindow = window as KeplrWindow;
    if (!keplrWindow.keplr) throw new WalletErrors.NotSupported("Keplr not present");
    return keplrWindow.keplr
  }
}
