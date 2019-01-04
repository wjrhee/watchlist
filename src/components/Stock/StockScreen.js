import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import StockChart from './StockChart';
import StockTable from './StockTable';

import { fetchChart } from '../../actions/Stock';

class StockScreen extends React.Component {
  componentDidMount() {
    this.props.fetchChart(this.props.navigation.state.params.stock.ticker);
  }

  render() {
    if (!this.props.isLoading) {
      return (
        <View>
          <StockTable stock={ this.props.navigation.state.params.stock }/>
          <StockChart data={ this.props.chart }/>
        </View>
      )
    } else {
      return (<Text>Loading</Text>)
    }
  }
};

StockScreen.defaultProps = {
  isLoading: true
}

export const mapStateToProps = (state) => {
  return {
    chart: state.Stock.chart,
    isLoading: state.Stock.isLoading
  }
};

export const mapDispatchToProps = {
  fetchChart
}

export default connect(mapStateToProps, mapDispatchToProps)(StockScreen);

