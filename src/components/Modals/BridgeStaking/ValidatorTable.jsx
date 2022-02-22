/* eslint-disable react/jsx-key */
import React, { useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components/macro';
import { useTable, useSortBy } from 'react-table';
import { Scrollbars } from 'react-custom-scrollbars';
import { BigNumber } from 'ethers';

import { SortBy } from '../Icons';
import { useOnomy } from 'context/chain/OnomyContext';
import { useAsyncValue } from 'hooks/useAsyncValue';
import { format18 } from 'utils/math';
import { FormattedNumber } from 'components/FormattedNumber';
import { OnomyFormulas } from 'OnomyClient/OnomyFormulas';

const StyledTable = styled.table`
  width: 100%;

  thead {
    display: block;

    margin-bottom: 24px;
    padding: 16px 0;

    border-top: 1px solid #302e3d;
    border-bottom: 1px solid #302e3d;

    tr {
      display: grid;
      grid-template-columns: 6fr 4fr 2fr;
      justify-items: start;

      width: 100%;

      th {
        display: flex;
        align-items: center;
        gap: 6px;

        font-size: 12px;
        font-weight: 400;
        color: ${props => props.theme.colors.textSecondary};

        user-select: none;
      }
    }
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 40px;

    max-height: 440px;
  }
`;

const sortedMixin = css`
  .arrow-up {
    fill: ${props =>
      props.sortedDesc ? props.theme.colors.textSecondary : props.theme.colors.textPrimary};
  }

  .arrow-down {
    fill: ${props =>
      props.sortedDesc ? props.theme.colors.textPrimary : props.theme.colors.textSecondary};
  }
`;

const SortIconWrapper = styled.span`
  height: 16px;

  svg path {
    fill: ${props => props.theme.colors.textSecondary};
  }

  ${props => (props.sorted ? sortedMixin : '')};
`;

const Validator = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  > img {
    border-radius: 4px;
  }
`;

const ValidatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.colors.textPrimary};
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ValidatorRow = styled.tr`
  display: grid;
  grid-template-columns: 6fr 4fr 2fr;
  align-items: center;

  width: 100%;

  background-color: ${props =>
    props.active ? props.theme.colors.bgHighlightBorder : 'transparent'};

  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.active ? props.theme.colors.bgHighlightBorder : props.theme.colors.bgNormal};
  }
`;

const APR = styled.div`
  color: ${props => props.theme.colors.highlightBlue};
  font-weight: 500;
`;

const Delegated = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-family: Bebas Neue, sans-serif;
    font-size: 20px;
    color: ${props => props.theme.colors.textPrimary};
  }

  span {
    font-size: 12px;
    font-weight: 500;
  }
`;

export default function ValidatorTable({ selected, setSelected }) {
  const { address, onomyClient, bridgedSupplyFormatted: bridgedSupply } = useOnomy();
  const stakingAPR = useMemo(() => OnomyFormulas.stakingRewardAPR(bridgedSupply), [bridgedSupply]);

  const [data, { error }] = useAsyncValue(
    useCallback(async () => {
      const [validators, delegationData] = await Promise.all([
        // TODO: more focused query?
        onomyClient.getValidators(),
        onomyClient.getDelegationsForDelegator(address),
      ]);

      return validators.map(res => {
        const delegation = delegationData.find(
          d => d.delegation.validator_address === res.operator_address
        );
        return {
          id: res.operator_address,
          validator: {
            name: res.description.moniker || res.operator_address,
            votingPower: format18(res.tokens).toString(),
          },
          rewards: {
            APR: stakingAPR,
            commissionRate: res.commission.commission_rates.rate.toNumber() * 100,
          },
          delegated: format18(delegation?.balance.amount ?? BigNumber.from(0)),
        };
      });
    }, [onomyClient, stakingAPR, address]),
    []
  );

  if (error) console.error('error', error);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'validator',
        Cell: ({ value }) => (
          <Validator>
            <img src="https://picsum.photos/64/72" alt="" />
            {/* {value.img} */}
            <ValidatorContent>
              <strong>{value.name}</strong>
              <span>
                <FormattedNumber value={value.votingPower} /> Voting Power
              </span>
            </ValidatorContent>
          </Validator>
        ),
      },
      {
        Header: 'APR',
        accessor: 'rewards',
        Cell: ({ value }) => (
          <APR>
            <div>{value.APR.toFixed(2)}%</div>
            <div>{value.commissionRate.toFixed(2)}% fee</div>
          </APR>
        ),
      },
      {
        Header: 'Delegated',
        accessor: 'delegated',
        Cell: ({ value }) => (
          <Delegated>
            <strong>
              <FormattedNumber value={value} />
            </strong>
          </Delegated>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <StyledTable {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <SortIconWrapper sorted={column.isSorted} sortedDesc={column.isSortedDesc}>
                  <SortBy />
                </SortIconWrapper>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <Scrollbars style={{ height: 440, width: 'auto' }}>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);

            return (
              <ValidatorRow
                {...row.getRowProps()}
                active={row.original.id === selected}
                onClick={() => setSelected(row.original.id)}
              >
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </ValidatorRow>
            );
          })}
        </tbody>
      </Scrollbars>
    </StyledTable>
  );
}
