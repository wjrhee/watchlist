import _ from 'lodash';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const StockTable = ({ stock }) => {
  const data = _.transform(stock, (acc, value, key) => {
    acc.push({ label: _.startCase(key), value: value });
    return acc;
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={ styles.listRow}>
        <Text style={ styles.listItem }>{ item.label }</Text>
        <Text style={ styles.listItem }>{ item.value }</Text>
      </View>
    );
  };

  const keyExtractor = (_, index) => index.toString();

  return (
    <View style={ styles.list }>
      <FlatList
        data={ data }
        renderItem={ renderItem }
        keyExtractor={ keyExtractor }
      />
    </View>
  )
};

const styles = StyleSheet.create({
  list: {
    margin: 20
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
  }
})

export default StockTable;