/* eslint-disable @typescript-eslint/naming-convention */
import { StargateClient } from '@cosmjs/stargate';

import { decodeIoTs } from 'utils/decodeIoTs';
import { ApiResponseCodec } from './ApiResponse';
import { OnomyAddress } from './OnomyAddress';

export class OnomyClient {
  private REST_URL: string;

  private WS_URL: string;

  private stargate!: Promise<StargateClient>;

  constructor(REST_URL: string, WS_URL: string) {
    this.REST_URL = REST_URL;
    this.WS_URL = WS_URL;
    this.connectStargate();
    this.getValidators();
  }

  async getAnomSupply() {
    const json = await this.getJson('/cosmos/bank/v1beta1/supply/anom');
    const {
      amount: { amount },
    } = decodeIoTs(ApiResponseCodec.SingleSupplyResponse, json);
    return amount;
  }

  async getMintInflation() {
    const json = await this.getJson('/cosmos/mint/v1beta1/inflation');
    const { inflation } = decodeIoTs(ApiResponseCodec.MintInflationResponse, json);
    return inflation;
  }

  async getMintParams() {
    const json = await this.getJson('/cosmos/mint/v1beta1/params');
    const { params } = decodeIoTs(ApiResponseCodec.MintParamsResponse, json);
    return params;
  }

  async getMintAnnualProvisions() {
    const json = await this.getJson('/cosmos/mint/v1beta1/annual_provisions');
    const { annual_provisions } = decodeIoTs(ApiResponseCodec.MintAnnualProvisionsResponse, json);
    return annual_provisions;
  }

  async getStakingPool() {
    const json = await this.getJson('/cosmos/bank/v1beta1/pool');
    const { pool } = decodeIoTs(ApiResponseCodec.StakingPoolResponse, json);
    return pool;
  }

  async getSlashingParams() {
    const json = await this.getJson('/cosmos/slashing/v1beta1/params');
    const { params } = decodeIoTs(ApiResponseCodec.SlashingParamsResponse, json);
    return params;
  }

  async getSlashingSigningInfos() {
    const json = await this.getJson('/cosmos/slashing/v1beta1/signing_infos');
    const { info } = decodeIoTs(ApiResponseCodec.SingingInfosResponse, json);
    return info;
  }

  async getDelegation(validatorAddress: string, delegatorAddress: string) {
    const json = await this.getJson(
      `/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${delegatorAddress}`
    );
    if (!(json as any)?.delegation_response) return null;
    const { delegation_response } = decodeIoTs(ApiResponseCodec.DelegationResponse, json);
    return delegation_response;
  }

  async getDelegationsForValidator(validatorAddress: string) {
    const json = await this.getJson(`/cosmos/staking/v1beta1/validators/${validatorAddress}`);
    const { delegation_responses } = decodeIoTs(ApiResponseCodec.DelegationsResponse, json);
    return delegation_responses;
  }

  async getDelegationsForDelegator(delegatorAddress: string) {
    const json = await this.getJson(`/cosmos/staking/v1beta1/delegations/${delegatorAddress}`);
    const { delegation_responses } = decodeIoTs(ApiResponseCodec.DelegationsResponse, json);
    return delegation_responses;
  }

  async getUndelegationsForDelegator(delegatorAddress: string) {
    const json = await this.getJson(
      `/cosmos/staking/v1beta1/delegators/${delegatorAddress}/unbonding_delegations`
    );
    const { unbonding_responses } = decodeIoTs(ApiResponseCodec.UnbondingsResponse, json);
    return unbonding_responses;
  }

  async getRewardsForDelegator(delegatorAddress: string) {
    const json = await this.getJson(
      `/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`
    );
    if (!(json as any).rewards) return null;
    const response = decodeIoTs(ApiResponseCodec.DelegatorRewardsResponse, json);
    return response;
  }

  async getAccountInfo(address: string) {
    const json = await this.getJson(`/osmos/auth/v1beta1/accounts/${address}`);
    const { account } = decodeIoTs(ApiResponseCodec.SingleAccountResponse, json);
    return account;
  }

  async getTransactions(/* address: string */) {
    // TODO: implement OnomyClient.getTransactions
    // `/cosmos/tx/v1beta1/txs?message.sender=${address}`
    // `/cosmos/tx/v1beta1/txs?transfer.recipient=${address}`

    throw new Error('getTransactions not implemented');
  }

  async getValidators() {
    const json = await this.getJson('/staking/validators?status=BOND_STATUS_BONDED');
    console.log('json', json);
    const { result } = decodeIoTs(ApiResponseCodec.ValidatorsResponse, json);
    console.log('validators', result);
    return result;
  }

  async getSelfDelegation(validatorAddress: string) {
    const hexOperatorAddress = OnomyAddress.decodeB32(validatorAddress);
    const delegatorAddress = OnomyAddress.encodeB32(hexOperatorAddress, 'onomy');
    return this.getDelegation(validatorAddress, delegatorAddress);
  }

  async getAddressBalance(address: string, denom: string) {
    // TODO: decode json for balance
    const stargate = await this.stargate;
    const coin = await stargate.getBalance(address, denom);
    return coin.amount; // TODO: BigNumber rather than string return?
  }

  private connectStargate() {
    try {
      this.stargate = StargateClient.connect(this.WS_URL);
      return this.stargate;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error connecting stargate to', this.WS_URL, e);
      throw e;
    }
  }

  private async getJson(path: string) {
    const res = await fetch(`${this.REST_URL}${path}`);
    const json = await res.json();
    return json as unknown;
  }
}
