import { BigNumber } from 'bignumber.js';

export const {
  REACT_APP_GRAPHQL_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/onomyprotocol/ograph',
  REACT_APP_ETHERSCAN_API_KEY = '3CVJBSFD6KVNBTNFCBN2T2QHRVYP1K81YB',
  REACT_APP_CHAIN_ID = 'onomy-4',
  REACT_APP_CHAIN_NAME = 'Onomy Devnet',
  REACT_APP_ONOMY_RPC_URL = 'https://rpc-devnet-0445.onomy.io',
  REACT_APP_ONOMY_REST_URL = 'https://rest-devnet-0445.onomy.io',
  REACT_APP_ONOMY_WS_URL = 'wss://rpc-devnet-0445.onomy.io',
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS = '0x52A4A4FBB36A2f6A83dBf7De9425C1ec5FF528Da',
  REACT_APP_WNOM_CONTRACT_ADDRESS = '0xe7c0fd1f0A3f600C1799CD8d335D31efBE90592C',
  REACT_APP_GRAVITY_CONTRACT_ADDRESS = '0x6cD2af5738ebF35AB66b833859048D9516C13D32',
  REACT_APP_SHOW_BRIDGED_NOM = false,
} = process.env;

export const DENOM = 'anom';
export const COIN_DENOM = 'NOM';
export const COIN_DENOM_DECIMALS = 18;
export const BLOCKS_TO_WAIT_FOR_BRIDGE = new BigNumber(
  process.env.REACT_APP_BLOCKS_TO_WAIT_FOR_BRIDGE || '14'
);

export const KEPLR_CONFIG = {
  features: ['stargate', 'no-legacy-stdTx'],

  // Chain-id of the Cosmos SDK chain.
  chainId: REACT_APP_CHAIN_ID,
  chainName: REACT_APP_CHAIN_NAME,
  rpc: REACT_APP_ONOMY_RPC_URL,
  rest: REACT_APP_ONOMY_REST_URL,
  stakeCurrency: {
    // Coin denomination to be displayed to the user.
    coinDenom: COIN_DENOM,
    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
    coinMinimalDenom: DENOM,
    coinDecimals: COIN_DENOM_DECIMALS,
    // coinGeckoId: ""
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'onomy',
    bech32PrefixAccPub: 'onomypub',
    bech32PrefixValAddr: 'onomyvaloper',
    bech32PrefixValPub: 'onomyvaloperpub',
    bech32PrefixConsAddr: 'onomyvalcons',
    bech32PrefixConsPub: 'onomyvalconspub',
  },
  currencies: [
    {
      coinDenom: COIN_DENOM,
      coinMinimalDenom: DENOM,
      coinDecimals: COIN_DENOM_DECIMALS,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: COIN_DENOM,
      coinMinimalDenom: DENOM,
      coinDecimals: COIN_DENOM_DECIMALS,
    },
  ],
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
};
