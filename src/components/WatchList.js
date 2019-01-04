import _ from 'lodash';
import React from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { connect } from 'react-redux';

import { deleteStockByTicker } from '../actions/WatchList';

const WatchList = (props) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={ () => props.goToStock(item.ticker) }
      >
        <View style={ styles.listRow }>
          <Text style={ styles.listItem }>{ item.ticker || '' }</Text>
          <Text style={ styles.listItem }>{ item.askPrice || 'n/a' }</Text>
          <Text style={ styles.listItem }>{ item.bidPrice || 'n/a' }</Text>
          <Text style={ styles.listItem }>{ item.lastPrice || '' }</Text>
          <Button
            onPress={ () => props.deleteStockByTicker(item.ticker) }
            title={ 'Delete' }
            color={ '#FF0000' }
            style={ styles.button }
          />
        </View>
      </TouchableHighlight>
    );
  };

  const keyExtractor = (item, index) => index.toString();
  const headers = _.map(_.keys(_.values(props.data)[0]), _.startCase);
  const headerComponent = (
    <View style={ styles.listRow }>
      {
        headers.map((header) => (
          <Text style={ styles.headerItem } key={ header }>{ header }</Text>
        ))
      }
      <Text style={ styles.lastItem }></Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={ headerComponent }
      data={ _.values(props.data) }
      renderItem={ renderItem }
      keyExtractor={ keyExtractor }
    />
  );
};

const styles = StyleSheet.create({
  button: {
    fontSize: 10,
    width: 30
  },
  headerItem: {
    flex: 1,
    fontSize: 14,
    justifyContent: 'flex-start'
  },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: 40
  },
  listItem: {
    flex: 1,
    fontSize: 18,
    justifyContent: 'flex-start'
  },
  lastItem: {
    flex: 1
  }
});

const mapDispatchToProps = {
  deleteStockByTicker
};

export default connect(null, mapDispatchToProps)(WatchList);