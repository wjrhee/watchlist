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
      <View style={ styles.listRow }>
        <TouchableHighlight
          onPress={ () => props.goToStock(item.ticker) }
          style={ styles.subRow }
        >
          <View style={ styles.subRowContainer }>
            <Text style={ styles.listItem }>{ item.ticker }</Text>
            <Text style={ styles.listItem }>{ item.askPrice }</Text>
            <Text style={ styles.listItem }>{ item.bidPrice }</Text>
            <Text style={ styles.listItem }>{ item.lastPrice }</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={ () => props.deleteStockByTicker(item.ticker) }
          style={ styles.delete }
        ><Text>Delete</Text></TouchableHighlight>
      </View>
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
      <Text style={ styles.headerItemLast }></Text>
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
  delete: {
    flexBasis: 50
  },
  headerItem: {
    flexGrow: 1,
    flexBasis: 0,
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
  subRow: {
    flexGrow: 1,
  },
  subRowContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },
  listItem: {
    flexGrow: 1,
    flexBasis: 0,
    fontSize: 18,
    justifyContent: 'flex-start'
  },
  headerItemLast: {
    flexBasis: 50
  }
});

const mapDispatchToProps = {
  deleteStockByTicker
};

export default connect(null, mapDispatchToProps)(WatchList);