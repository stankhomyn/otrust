/* eslint-disable react/jsx-key */
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { useTable, useSortBy } from 'react-table';

import { SortBy } from '../Icons';

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

    tr {
      display: grid;
      grid-template-columns: 6fr 4fr 2fr;
      align-items: center;

      width: calc(100% + 64px);
      padding: 10px 32px;
      margin: -10px -32px;
    }
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
    color: ${props => props.theme.colors.highlightGreen};
  }
`;

export default function ValidatorTable() {
  const [activeValidatorId, setActiveValidatorId] = useState(null);

  const data = useMemo(
    () => [
      {
        id: '1',
        validator: {
          name: 'ACoinBase Custody',
          votingPower: '13,9M',
        },
        APR: 13.54,
        delegated: {
          value: 1.22,
          change: 4552.98,
          changeType: 'UP',
        },
      },
      {
        id: '2',
        validator: {
          name: 'Binance Staking',
          votingPower: '15,9M',
        },
        APR: 9.54,
        delegated: {
          value: 2.22,
          change: 22.98,
          changeType: 'DOWN',
        },
      },
      {
        id: '3',
        validator: {
          name: 'CoinBase Custody',
          votingPower: '13,9M',
        },
        APR: 3.54,
        delegated: {
          value: 3.22,
          change: 0,
        },
      },
    ],
    []
  );

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
              <span>{value.votingPower} Voting Power</span>
            </ValidatorContent>
          </Validator>
        ),
      },
      {
        Header: 'APR',
        accessor: 'APR',
        Cell: ({ value }) => <APR>{value}%</APR>,
      },
      {
        Header: 'Delegated',
        accessor: 'delegated',
        Cell: ({ value }) => (
          <Delegated>
            <strong>{value.value}</strong>
            <span>
              ${value.change} {value.changeType}
            </span>
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
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);

          return (
            <ValidatorRow
              {...row.getRowProps()}
              active={row.original.id === activeValidatorId}
              onClick={() => setActiveValidatorId(row.original.id)}
            >
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </ValidatorRow>
          );
        })}
      </tbody>
    </StyledTable>
  );
}
