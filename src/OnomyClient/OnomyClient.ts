/* eslint-disable @typescript-eslint/naming-convention */
import { SigningStargateClient } from '@cosmjs/stargate';
import BigNumber from 'bignumber.js';

import { decodeIoTs } from 'utils/decodeIoTs';
import { ApiResponseCodec } from './ApiResponse';
import { OnomyAddress } from './OnomyAddress';
import { DENOM, KEPLR_CONFIG } from 'constants/env';
import { OnomyStargateClient } from './OnomyStargateClient';
import { OnomyConstants } from './OnomyConstants';

export class OnomyClient {
  private REST_URL: string;

  private WS_URL: string;

  private stargate!: Promise<OnomyStargateClient>;

  constructor(REST_URL: string, WS_URL: string) {
    this.REST_URL = REST_URL;
    this.WS_URL = WS_URL;
    this.connectStargate();
    this.getValidators();
  }

  async delegate(validatorAddress: string, amount: BigNumber, denom = DENOM) {
    const signer = this.getSigner();
    const [account] = await signer.getAccounts();
    const sg = await SigningStargateClient.connectWithSigner(this.WS_URL, signer, {
      gasPrice: OnomyConstants.GAS_PRICE,
    });
    await sg.delegateTokens(
      account.address,
      validatorAddress,
      {
        amount: amount.toString(),
        denom,
      },
      'auto'
    );
  }

  async undelegate(validatorAddress: string, amount: BigNumber, denom = DENOM) {
    const signer = this.getSigner();
    const [account] = await signer.getAccounts();
    const sg = await SigningStargateClient.connectWithSigner(this.WS_URL, signer, {
      gasPrice: OnomyConstants.GAS_PRICE,
    });
    await sg.undelegateTokens(
      account.address,
      validatorAddress,
      {
        amount: amount.toString(),
        denom,
      },
      'auto'
    );
  }

  async getAnomSupply() {
    const sg = await this.stargate;
    return sg.getDenomSupply(DENOM);
  }

  async getMintInflation() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/mint/v1beta1/inflation');
    const { inflation } = decodeIoTs(ApiResponseCodec.MintInflationResponse, json);
    return inflation;
  }

  async getMintParams() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/mint/v1beta1/params');
    const { params } = decodeIoTs(ApiResponseCodec.MintParamsResponse, json);
    return params;
  }

  async getMintAnnualProvisions() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/mint/v1beta1/annual_provisions');
    const { annual_provisions } = decodeIoTs(ApiResponseCodec.MintAnnualProvisionsResponse, json);
    return annual_provisions;
  }

  async getStakingPool() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/bank/v1beta1/pool');
    const { pool } = decodeIoTs(ApiResponseCodec.StakingPoolResponse, json);
    return pool;
  }

  async getSlashingParams() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/slashing/v1beta1/params');
    const { params } = decodeIoTs(ApiResponseCodec.SlashingParamsResponse, json);
    return params;
  }

  async getSlashingSigningInfos() {
    // TODO: use stargate instead
    const json = await this.getJson('/cosmos/slashing/v1beta1/signing_infos');
    const { info } = decodeIoTs(ApiResponseCodec.SingingInfosResponse, json);
    return info;
  }

  async getDelegation(validatorAddress: string, delegatorAddress: string) {
    const sg = await this.stargate;
    const res = await sg.getDelegation(delegatorAddress, validatorAddress);
    return new BigNumber(res?.amount ?? '0');
  }

  async getDelegationsForValidator(validatorAddress: string) {
    const sg = await this.stargate;
    return sg.getDelegationsForDelegator(validatorAddress);
  }

  async getDelegationsForDelegator(delegatorAddress: string) {
    const sg = await this.stargate;
    return sg.getDelegationsForDelegator(delegatorAddress);
  }

  async getUndelegationsForDelegator(delegatorAddress: string) {
    // TODO: use stargate instead
    const json = await this.getJson(
      `/cosmos/staking/v1beta1/delegators/${delegatorAddress}/unbonding_delegations`
    );
    const { unbonding_responses } = decodeIoTs(ApiResponseCodec.UnbondingsResponse, json);
    return unbonding_responses;
  }

  async getRewardsForDelegator(delegatorAddress: string) {
    const sg = await this.stargate;
    return sg.getRewardsForDelegator(delegatorAddress);
  }

  async getAccountInfo(address: string) {
    // TODO: use stargate instead
    const json = await this.getJson(`/cosmos/auth/v1beta1/accounts/${address}`);
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
    const sg = await this.stargate;
    return sg.getValidators();
  }

  async getSelfDelegation(validatorAddress: string) {
    const hexOperatorAddress = OnomyAddress.decodeB32(validatorAddress);
    const delegatorAddress = OnomyAddress.encodeB32(hexOperatorAddress, 'onomy');
    return this.getDelegation(validatorAddress, delegatorAddress);
  }

  async getAddressBalance(address: string, denom: string) {
    const stargate = await this.stargate;
    const coin = await stargate.getBalance(address, denom);
    return coin.amount; // TODO: BigNumber rather than string return?
  }

  private connectStargate() {
    try {
      this.stargate = OnomyStargateClient.connect(this.WS_URL);
      return this.stargate;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error connecting stargate to', this.WS_URL, e);
      throw e;
    }
  }

  private async getJson(path: string) {
    // TODO: use stargate instead and remove this
    const res = await fetch(`${this.REST_URL}${path}`);
    const json = await res.json();
    return json as unknown;
  }

  private getSigner() {
    // TODO: support other signers than keplr
    const chainIdParts = KEPLR_CONFIG.chainId.split('-');
    chainIdParts.pop();
    const chainId = chainIdParts.join('-');
    const signer = window.getOfflineSigner && window.getOfflineSigner(chainId);
    if (!signer) throw new Error('No Signer: Install Keplr');
    return signer;
  }
}
