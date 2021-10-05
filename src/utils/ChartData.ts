import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';
import { BigNumber } from 'bignumber.js';

import {
  ErrorCallback,
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  PeriodParams,
} from 'charting_library/charting_library';

const WNOM_HISTORICAL_DATA_QUERY = gql`
  query transactions($filter: String!, $skipped: Int!) {
    wnomhistoricalFrames(
      first: 1000
      skip: $skipped
      where: { type: $filter }
      orderBy: startTime
      orderDirection: asc
    ) {
      startTime
      endTime
      startPrice
      endPrice
      minPrice
      maxPrice
    }
  }
`;

const PERIOD_MAP = {
  '1D': 'Day',
};

function formatPrice(price: string) {
  return new BigNumber(price).shiftedBy(-18).toFixed(10);
}

// @ts-ignore
export class ChartData extends window.Datafeeds.UDFCompatibleDatafeed implements IDatafeedChartApi {
  // TODO this shouldn't need to extend UDF... when completed

  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(apolloClient: ApolloClient<NormalizedCacheObject>, url: string) {
    super(url);
    this.apolloClient = apolloClient;
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback
  ) {
    try {
      console.log({ symbolInfo, resolution, periodParams });

      const resp = await this.apolloClient.query({
        query: WNOM_HISTORICAL_DATA_QUERY,
        variables: {
          // @ts-ignore
          filter: PERIOD_MAP[resolution] || 'Hour', // TODO: map from resolution
          skipped: 0,
        },
      });

      const {
        data: { wnomhistoricalFrames: frames },
      } = resp;

      const bars = frames.map(
        (frame: {
          startTime: any;
          startPrice: any;
          maxPrice: any;
          minPrice: any;
          endPrice: any;
        }) => ({
          time: parseInt(frame.startTime, 10) * 1000,
          open: formatPrice(frame.startPrice),
          high: formatPrice(frame.maxPrice),
          low: formatPrice(frame.minPrice),
          close: formatPrice(frame.endPrice),
          volume: 0,
        })
      );

      console.log('resp', frames);
      console.log('bars', bars);

      if (periodParams.firstDataRequest) {
        onResult(bars, { noData: false });
      } else {
        onResult([], { noData: true });
      }
    } catch (e) {
      onError(`${e}`);
    }

    /*
    function onRes(...args: any[]) {
      console.log('onResult', args);
      // @ts-ignore
      onResult(...args);
    }
    */

    // TODO
    //if (periodParams.firstDataRequest) {
    // super.getBars(symbolInfo, resolution, periodParams, onRes, onError);
    //}
  }
}
