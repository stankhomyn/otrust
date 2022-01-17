import { StargateClient } from '@cosmjs/stargate';

export class OnomyClient {
  private REST_URL: string;

  private WS_URL: string;

  private stargate!: Promise<StargateClient>;

  constructor(REST_URL: string, WS_URL: string) {
    this.REST_URL = REST_URL;
    this.WS_URL = WS_URL;
    this.connectStargate();
  }

  async getSupply() {
    // TODO: decode json for supply
    const res = await fetch(`${this.REST_URL}/cosmos/bank/v1beta1/supply/anom`);
    const json = await res.json();
    const val = json.amount.amount || '';
    return val;
  }

  async getValidators() {
    // TODO: decode json for validators
    const res = await fetch(`${this.REST_URL}/staking/validators?status=BOND_STATUS_BONDED`);
    const json = await res.json();
    console.log('validators json', json);
  }

  async getAddressBalance(address: string, denom: string) {
    // TODO: decode json for balance
    const stargate = await this.stargate;
    const coin = await stargate.getBalance(address, denom);
    return coin.amount;
  }

  private connectStargate() {
    try {
      this.stargate = StargateClient.connect(this.WS_URL);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error connecting stargate to', this.WS_URL, e);
      throw e;
    }
  }
}
