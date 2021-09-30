/* eslint-disable react/destructuring-assignment */
import * as React from 'react';

import { widget } from '../../charting_library';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent {
  tvWidget = null;

  constructor(props) {
    super(props);
    this.state = {
      symbol: 'AAPL',
      interval: 'D',
      containerId: 'tv_chart_container',
      datafeedUrl: 'https://demo_feed.tradingview.com',
      libraryPath: '../../charting_library/',
      chartsStorageUrl: 'https://saveload.tradingview.com',
      chartsStorageApiVersion: '1.1',
      clientId: 'tradingview.com',
      userId: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studiesOverrides: {},
    };
  }

  componentDidMount() {
    const widgetOptions = {
      symbol: this.state.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.state.datafeedUrl),
      interval: this.state.interval,
      container_id: this.state.containerId,
      library_path: this.state.libraryPath,

      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: this.state.chartsStorageUrl,
      charts_storage_api_version: this.state.chartsStorageApiVersion,
      client_id: this.state.clientId,
      user_id: this.state.userId,
      fullscreen: this.state.fullscreen,
      autosize: this.state.autosize,
      studies_overrides: this.state.studiesOverrides,
    };

    // eslint-disable-next-line new-cap
    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute('title', 'Click to show a notification popup');
        button.classList.add('apply-common-tooltip');
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!');
            },
          })
        );

        button.innerHTML = 'Check API';
      });
    });
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return <div id={this.state.containerId} />;
  }
}
