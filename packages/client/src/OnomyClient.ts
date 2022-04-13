import { SigningStargateClient } from '@cosmjs/stargate';
import BigNumber from 'bignumber.js';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';

import { OnomyAddress } from './OnomyAddress';
import { OnomyStargateClient } from './OnomyStargateClient';
import { OnomyConstants } from './OnomyConstants';
import { OnomyFormulas } from './OnomyFormulas';

export class OnomyClient {
  private WS_URL: string;

  private stargate?: Promise<OnomyStargateClient>;

  private signer: OfflineDirectSigner | null = null;

  private denom = OnomyConstants.DENOM;

  constructor(WS_URL: string, denom = OnomyConstants.DENOM) {
    this.WS_URL = WS_URL.replace('https://', 'wss://');
    this.denom = denom;
  }

  setSigner(signer: OfflineDirectSigner | null) {
    this.signer = signer;
  }

  denomDecimalFromFixed(amount: BigNumber, decimalPlaces = OnomyConstants.DENOM_DECIMAL_PLACES) {
    return amount.div(new BigNumber(10 ** decimalPlaces));
  }

  denomNumberFromFixed(amount: BigNumber, decimalPlaces = OnomyConstants.DENOM_DECIMAL_PLACES) {
    return this.denomDecimalFromFixed(amount, decimalPlaces).toNumber();
  }

  async delegate(validatorAddress: string, amount: BigNumber, denom = '') {
    const signer = this.getSigner();
    const [account] = await signer.getAccounts();
    const sg = await SigningStargateClient.connectWithSigner(this.WS_URL, signer, {
      gasPrice: OnomyConstants.GAS_PRICE,
    });
    await sg.delegateTokens(
      account.address,
      validatorAddress,
      {
        amount: amount.toFixed(),
        denom: denom || this.denom,
      },
      'auto'
    );
  }

  async undelegate(validatorAddress: string, amount: BigNumber, denom = '') {
    const signer = this.getSigner();
    const [account] = await signer.getAccounts();
    const sg = await SigningStargateClient.connectWithSigner(this.WS_URL, signer, {
      gasPrice: OnomyConstants.GAS_PRICE,
    });
    await sg.undelegateTokens(
      account.address,
      validatorAddress,
      {
        amount: amount.toFixed(),
        denom: denom || this.denom,
      },
      'auto'
    );
  }

  async withdrawRewards(validatorAddress: string) {
    const signer = this.getSigner();
    const [account] = await signer.getAccounts();
    const sg = await SigningStargateClient.connectWithSigner(this.WS_URL, signer, {
      gasPrice: OnomyConstants.GAS_PRICE,
    });
    return sg.withdrawRewards(account.address, validatorAddress, 'auto');
  }

  async getAnomSupply() {
    const sg = await this.getStargate();
    const fixed = await sg.getDenomSupply(this.denom);
    return this.denomDecimalFromFixed(fixed);
  }

  async getMintInflation() {
    const sg = await this.getStargate();
    return sg.getMintInflation();
  }

  async getMintParams() {
    throw new Error('Not implemented');
  }

  async getMintAnnualProvisions() {
    throw new Error('Not implemented');
  }

  async getStakingPool() {
    throw new Error('Not implemented');
  }

  async getSlashingParams() {
    throw new Error('Not implemented');
  }

  async getSlashingSigningInfos() {
    throw new Error('Not implemented');
  }

  async getDelegation(validatorAddress: string, delegatorAddress: string) {
    const sg = await this.getStargate();
    const res = await sg.getDelegation(delegatorAddress, validatorAddress);
    return new BigNumber(res?.amount ?? '0');
  }

  async getDelegationsForValidator(validatorAddress: string) {
    const sg = await this.getStargate();
    return sg.getDelegationsForDelegator(validatorAddress);
  }

  async getDelegationsForDelegator(delegatorAddress: string) {
    const sg = await this.getStargate();
    return sg.getDelegationsForDelegator(delegatorAddress);
  }

  async getUndelegationsForDelegator(_delegatorAddress: string) {
    throw new Error('Not implemented');
  }

  async getRewardsForDelegator(delegatorAddress: string) {
    const sg = await this.getStargate();
    return sg.getRewardsForDelegator(delegatorAddress);
  }

  async getAccountInfo(_address: string) {
    throw new Error('Not implemented');
  }

  async getTransactions(_address: string) {
    // TODO: implement OnomyClient.getTransactions
    // `/cosmos/tx/v1beta1/txs?message.sender=${address}`
    // `/cosmos/tx/v1beta1/txs?transfer.recipient=${address}`

    throw new Error('Not implemented');
  }

  async getValidators() {
    const sg = await this.getStargate();
    return sg.getValidators();
  }

  async getSelfDelegation(validatorAddress: string) {
    const hexOperatorAddress = OnomyAddress.decodeB32(validatorAddress);
    const delegatorAddress = OnomyAddress.encodeB32(hexOperatorAddress, 'onomy');
    return this.getDelegation(validatorAddress, delegatorAddress);
  }

  async getAddressBalance(address: string, denom: string) {
    const stargate = await this.getStargate();
    const coin = await stargate.getBalance(address, denom);
    return coin.amount; // TODO: BigNumber rather than string return?
  }

  async getUnbondingDelegationsForDelegator(delegatorAddress: string) {
    const stargate = await this.getStargate();
    return stargate.getUnbondingDelegations(delegatorAddress);
  }

  async getTotalUnbondingForDelegator(delegatorAddress: string) {
    /*
    [
        {
            "delegatorAddress": "onomy1599nj49jvvg3rlq9dpgrsn6vwwauzw5mchuhwd",
            "validatorAddress": "onomyvaloper18hskl5e779xymx5r7m8huheznpe0wqfkme9x94",
            "entries": [
                {
                    "creationHeight": {
                        "low": 370925,
                        "high": 0,
                        "unsigned": false
                    },
                    "initialBalance": "1000000000000000000000",
                    "balance": "1000000000000000000000",
                    "completionTime": {
                        "seconds": {
                            "low": 1649459970,
                            "high": 0,
                            "unsigned": false
                        },
                        "nanos": 378065251
                    }
                }
            ]
        }
    ]
    */
    const unbondings = await this.getUnbondingDelegationsForDelegator(delegatorAddress);
    return unbondings.reduce(
      (sum, validator) =>
        validator.entries.reduce(
          (sumInner, entry) => sumInner.plus(new BigNumber(entry.balance)),
          sum
        ),
      new BigNumber(0)
    );
  }

  async getValidatorsForDelegator(delegator: string) {
    const [validators, bridgedSupplyNom, delegationData, inflationRate] = await Promise.all([
      this.getValidators(),
      this.getAnomSupply(),
      delegator ? this.getDelegationsForDelegator(delegator) : Promise.resolve([]),
      this.getMintInflation(),
    ]);

    const totalStakedAtoms = validators.reduce(
      (sum, v) => new BigNumber(v.tokens).plus(sum),
      new BigNumber(0)
    );

    const APR = OnomyFormulas.getEstYearlyStakingRewardPercentage(
      bridgedSupplyNom.shiftedBy(18),
      totalStakedAtoms,
      inflationRate.toFloatApproximation()
    );

    return validators.map(validator => {
      const delegation = delegationData.find(
        d => d.delegation?.validatorAddress === validator.operatorAddress
      );
      const staked = new BigNumber(validator.tokens);
      return {
        id: validator.operatorAddress,
        validator: {
          name: validator.description?.moniker ?? validator.operatorAddress,
          votingPower: staked.multipliedBy(100).div(totalStakedAtoms).toNumber(),
        },
        rewards: {
          APR,
          commissionRate:
            this.denomNumberFromFixed(
              new BigNumber(validator.commission?.commissionRates?.rate ?? '0')
            ) * 100,
        },
        delegated: this.denomDecimalFromFixed(new BigNumber(delegation?.balance?.amount ?? '0')),
      };
    });
  }

  async getValidatorForDelegator(delegator: string, validator?: string) {
    if (!validator) return { validator: null, delegation: new BigNumber(0) };
    const [validators, selfDelegation, delegationData, rewardsData] = await Promise.all([
      // TODO: more focused query?
      this.getValidators(),
      this.getSelfDelegation(validator),
      delegator ? this.getDelegation(validator, delegator) : Promise.resolve(new BigNumber(0)),
      delegator ? this.getRewardsForDelegator(delegator) : Promise.resolve(null),
    ]);
    const totalStaked = validators.reduce(
      (sum, v) => new BigNumber(v.tokens).plus(sum),
      new BigNumber(0)
    );

    const validatorData = validators.find(v => v.operatorAddress === validator);
    const staked = new BigNumber(validatorData?.tokens ?? '0');
    const votingPower = staked.multipliedBy(100).div(totalStaked).toNumber();
    if (!validatorData) return { validator: null, delegation: delegationData };
    const selfStakeRate = selfDelegation.div(validatorData.tokens);
    const rewardItems = rewardsData?.rewards.find(v => v.validatorAddress === validator);
    const rewardItem = rewardItems?.reward.find(r => r.denom === OnomyConstants.DENOM);
    return {
      validator: validatorData,
      votingPower,
      selfDelegation,
      selfStake: selfStakeRate ? selfStakeRate.toNumber() : 0,
      delegation: delegationData,
      rewards: rewardItem,
    };
  }

  async getEstYearlyStakingReward() {
    const [validators, bridgedSupplyNom, inflationRate] = await Promise.all([
      this.getValidators(),
      this.getAnomSupply(),
      this.getMintInflation(),
    ]);

    const totalStakedAtoms = validators.reduce(
      (sum, v) => new BigNumber(v.tokens).plus(sum),
      new BigNumber(0)
    );

    return OnomyFormulas.getEstYearlyStakingRewardPercentage(
      bridgedSupplyNom.shiftedBy(18),
      totalStakedAtoms,
      inflationRate.toFloatApproximation()
    );
  }

  private getStargate() {
    if (this.stargate) return this.stargate;
    this.stargate = this.connectStargate();
    return this.stargate;
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

  private getSigner() {
    if (!this.signer) throw new Error('No Signer: Install Keplr');
    return this.signer;
  }
}
