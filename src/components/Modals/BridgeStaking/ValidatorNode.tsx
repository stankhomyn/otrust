import React, { useCallback } from 'react';
import styled from 'styled-components/macro';
import { Link, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';

import ValidatorFooter from './ValidatorFooter';
import ValidatorNodeHeader from './ValidatorNodeHeader';
import * as Modal from '../styles';
import BackButton from './BackButton';
import StakingModal from './StakingModal';
import { useOnomy } from 'context/chain/OnomyContext';
import { useAsyncValue } from 'hooks/useAsyncValue';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import { format18 } from 'utils/math';
import { FormattedNumber } from 'components/FormattedNumber';
import { EquivalentValue } from 'components/EquivalentValue';

const DelegateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DelegateItem = styled.div<{
  reward?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 50%;

  & + & {
    padding-left: 55px;

    border-left: 1px solid ${props => props.theme.colors.bgHighlightBorder};
  }

  > span {
    font-size: 14px;
    font-weight: 500;
    color: #9595a6;
  }

  > strong {
    margin-top: 16px;

    font-family: Bebas Neue, sans-serif;
    font-size: 40px;
    font-weight: 600;
    color: ${props =>
      props.reward ? props.theme.colors.highlightBlue : props.theme.colors.textPrimary};

    > sup {
      margin-left: 6px;
      font-size: 18px;
    }
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 24px 100px;

  padding: 32px 0;
  margin-top: 40px;

  border-top: 1px solid ${props => props.theme.colors.bgHighlightBorder};
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(50% - 50px);

  > span {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.colors.textThirdly};
  }

  > strong {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export default function ValidatorNode() {
  const { onomyClient, address } = useOnomy();
  const { id } = useParams();

  const [{ validator, delegation, rewards = null, selfStake = 0 }, { error, pending }] =
    useAsyncValue(
      useCallback(async () => {
        if (!id) return { validator: null, delegation: null };
        const [validators, selfDelegation, delegationData, rewardsData] = await Promise.all([
          // TODO: more focused query?
          onomyClient.getValidators(),
          onomyClient.getSelfDelegation(id),
          onomyClient.getDelegation(id, address),
          onomyClient.getRewardsForDelegator(id),
        ]);
        const validatorData = validators.find(v => v.operator_address === id);
        if (!validatorData) return { validator: null, delegation: delegationData };
        const selfStakeRate = selfDelegation?.balance.amount.div(validatorData.tokens);
        const rewardItems = rewardsData?.rewards.find(v => v.validator_address === id);
        const rewardItem = rewardItems?.reward.find(r => r.denom === 'nom'); // TODO: don't hardcode?
        return {
          validator: validatorData,
          selfDelegation,
          selfStake: selfStakeRate ? selfStakeRate.toNumber() : 0,
          delegation: delegationData,
          rewards: rewardItem,
        };
      }, [onomyClient, id, address]),
      { validator: null, delegation: null, rewards: null, selfStake: 0 }
    );

  if (pending) {
    return (
      <StakingModal>
        <LoadingSpinner />
      </StakingModal>
    );
  }

  if (error) {
    return (
      <StakingModal>
        <pre>{`${error}`}</pre>
      </StakingModal>
    );
  }

  if (!validator) {
    return <StakingModal>No Matching Validator</StakingModal>;
  }

  return (
    <StakingModal>
      <Modal.StakingWrapper>
        <Link to="/select-validator">
          <BackButton />
        </Link>
        <ValidatorNodeHeader
          name={validator.description.moniker ?? ''}
          url={validator.description.website}
          estimatedAPR={validator.commission.commission_rates.rate.toNumber() * 100}
        />

        <DelegateWrapper>
          <DelegateItem>
            <span>Delegated</span>
            <strong>
              <FormattedNumber
                value={format18(delegation?.balance.amount ?? new BigNumber(0)).toNumber()}
              />
              <sup>NOM</sup>
            </strong>
            <span>
              <EquivalentValue
                asset="NOM"
                prefix="$"
                amount={format18(delegation?.balance.amount ?? new BigNumber(0)).toNumber()}
              />
            </span>
          </DelegateItem>
          <DelegateItem reward>
            <span>Reward</span>
            <strong>
              <FormattedNumber value={format18(rewards?.amount ?? new BigNumber(0)).toNumber()} />
              <sup>XRP</sup>
            </strong>
            <EquivalentValue
              asset="NOM"
              prefix="$"
              amount={format18(rewards?.amount ?? new BigNumber(0)).toNumber()}
            />
          </DelegateItem>
        </DelegateWrapper>

        <Footer>
          <FooterInfo>
            <span>Total Bonded</span>
            <strong>
              <FormattedNumber value={format18(validator.tokens).toNumber()} /> XRP
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Self Bonded Rate</span>
            <strong>
              {100 * selfStake}
              <sup>%</sup>
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Commission</span>
            <strong>
              <FormattedNumber
                value={validator.commission.commission_rates.rate.toNumber() * 100}
              />
              <sup>%</sup>
            </strong>
          </FooterInfo>
          <FooterInfo>
            <span>Voting Power</span>
            <strong>
              <FormattedNumber value={format18(validator.delegator_shares).toNumber()} />
            </strong>
          </FooterInfo>
        </Footer>
      </Modal.StakingWrapper>
      <ValidatorFooter>
        <Modal.SecondaryButton type="button">Undelegate</Modal.SecondaryButton>
        <Link to="/validator-delegation">
          <Modal.PrimaryButton type="button">Delegate</Modal.PrimaryButton>
        </Link>
      </ValidatorFooter>
    </StakingModal>
  );
}
