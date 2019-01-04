import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Stock from '../../models/Stock';
import { addStock } from '../../actions/WatchList';

const SearchList = ({ addStock, data, selectedWatchList, goBack }) => {
  const addToSelectedWatchList = async (ticker) => {
    const stock = new Stock({ ticker });
    await addStock(stock, selectedWatchList);
    goBack();
  }

  const renderItem = ({ item }) => (
    <TouchableHighlight
      onPress={ () => addToSelectedWatchList(item.ticker) }
    >
      <View style={ styles.listRow }>
        <Text style={ styles.listTicker }>{ item.ticker }</Text>
        <Text style={ styles.listName }>{ _.startCase(item.name) }</Text>
      </View>
    </TouchableHighlight>
  );

  const keyExtractor = (item, index) => index.toString();

  return (
    <FlatList
      renderItem={ renderItem }
      data={ data }
      keyExtractor={ keyExtractor }
      style={ styles.list }
    />
  )
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: 50
  },
  listTicker: {
    flex: 1,
    flexGrow: 1,
    fontSize: 12,
    justifyContent: 'flex-start'
  },
  listName: {
    flex: 1,
    flexGrow: 3,
    fontSize: 12,
    justifyContent: 'flex-start'
  }
});

const mapStateToProps = (state) => ({ selectedWatchList: state.WatchList.selected });

const mapDispatchToProps = { addStock };

export default connect(mapStateToProps, mapDispatchToProps)(SearchList);