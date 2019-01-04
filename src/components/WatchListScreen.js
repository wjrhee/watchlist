import _ from 'lodash';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { fetchChart } from '../actions/Stock';
import { fetchStocks, setupDefaultWatchList } from '../actions/WatchList';

import WatchList from './WatchList';

import { routes } from '../config/constants';

export class WatchListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.goToStock = this.goToStock.bind(this);
    this.goToSearch = this.goToSearch.bind(this);
    this.goToWatchListList = this.goToWatchListList.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.fetchStocks(this.props.selected);
    }, 5000)

    this.props.setupDefaultWatchList().then(() => {
      if (this.props.selected) {
        this.props.fetchStocks(this.props.selected);
        this.props.navigation.setParams({ name: _.get(this.props.selected, 'name') || '' });
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  goToStock(ticker) {
    if (this.props.selected) {
      const stock = this.props.stocks[_.upperCase(ticker)];
      this.props.navigation.navigate({ routeName: routes.Stock, params: { stock } });
    }
  }

  goToSearch() {
    this.props.navigation.navigate({ routeName: routes.Search });
  }

  goToWatchListList() {
    this.props.navigation.navigate({ routeName: routes.WatchListList })
  }

  render() {
    const stockSearch = (
      <Button
        onPress={ this.goToSearch }
        title={ 'Stock Search' }
        color={ '#AAAAAA' }
      />
    );

    const watchListList = (
      <Button
        onPress={ this.goToWatchListList }
        title={ 'Select Watch List' }
        color={ '#AAAAAA' }
      />
    );

    if (this.props.isLoading) {
      return (<Text>Loading</Text>);
    } else {
      return (
        <View style={styles.container}>
          <WatchList
            title={ _.get(this.props.selected, 'name') }
            data={ this.props.stocks }
            goToStock={ this.goToStock }
          />
          { stockSearch }
          { watchListList }
        </View>
      );
    }
  }
};

WatchListScreen.defaultProps = {
  isLoading: true
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10
  }
});

export const mapStateToProps = (state) => {
  return {
    selected: state.WatchList.selected,
    isLoading: state.WatchList.isLoading,
    stocks: state.WatchList.stocks
  };
}

export const mapDispatchToProps = {
  fetchChart,
  fetchStocks,
  setupDefaultWatchList
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchListScreen);
