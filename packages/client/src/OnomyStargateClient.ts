import {
  AuthExtension,
  BankExtension,
  DistributionExtension,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  setupTxExtension,
  StakingExtension,
  StargateClient,
  TxExtension,
} from '@cosmjs/stargate';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import BigNumber from 'bignumber.js';

export class OnomyStargateClient extends StargateClient {
  protected readonly onomyQueryClient: QueryClient &
    AuthExtension &
    BankExtension &
    StakingExtension &
    TxExtension &
    DistributionExtension;

  public static async connect(endpoint: string): Promise<OnomyStargateClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new OnomyStargateClient(tmClient);
  }

  protected constructor(tmClient: Tendermint34Client) {
    super(tmClient);
    this.onomyQueryClient = QueryClient.withExtensions(
      tmClient,
      setupAuthExtension,
      setupBankExtension,
      setupStakingExtension,
      setupTxExtension,
      setupDistributionExtension
    );
  }

  protected getQueryClient() {
    return this.onomyQueryClient;
  }

  public async getDenomSupply(denom: string) {
    const qc = this.getQueryClient();
    const res = await qc?.bank.supplyOf(denom);
    if (!res) return new BigNumber(0);
    return new BigNumber(res.amount);
  }

  public async getValidators() {
    const qc = this.getQueryClient();
    const res = await qc?.staking.validators('BOND_STATUS_BONDED');
    return res?.validators ?? [];
  }

  public async getDelegationsForDelegator(delegatorAddress: string) {
    const qc = this.getQueryClient();
    const res = await qc?.staking.delegatorDelegations(delegatorAddress);
    return res?.delegationResponses ?? [];
  }

  public async getRewardsForDelegator(delegatorAddress: string) {
    const qc = this.getQueryClient();
    const res = await qc?.distribution.delegationTotalRewards(delegatorAddress);
    return res;
  }
}
