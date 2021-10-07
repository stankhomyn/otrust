/* eslint-disable react/destructuring-assignment */
import * as React from 'react';

import { widget } from '../../charting_library';
import { ChartData } from 'utils/ChartData';
import { ChainContext } from 'context/chain/ChainContext';

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
      symbol: 'NOM',
      interval: '1D',
      containerId: 'tv_chart_container',
      libraryPath: '../../charting_library/',
      fullscreen: false,
      autosize: true,
      studiesOverrides: {},
    };
  }

  componentDidMount() {
    const { client } = this.context;
    const widgetOptions = {
      symbol: this.state.symbol,
      datafeed: new ChartData(client),
      interval: this.state.interval,
      container_id: this.state.containerId,
      library_path: this.state.libraryPath,

      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_compare',
        'header_symbol_search',
      ],
      enabled_features: [],
      theme: 'Dark',
      fullscreen: this.state.fullscreen,
      autosize: this.state.autosize,
      studies_overrides: this.state.studiesOverrides,
    };

    // eslint-disable-next-line new-cap
    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    /*
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
    */
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

TVChartContainer.contextType = ChainContext;
