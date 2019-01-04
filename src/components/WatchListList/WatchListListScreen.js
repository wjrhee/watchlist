import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';

import { createWatchList, deleteWatchList, setSelected } from '../../actions/WatchList';
import { routes } from '../../config/constants';

class WatchListListScreen extends React.Component {
  constructor(props) {
    super(props);

    state = { newWatchListName: '' }

    this.setSelected = this.setSelected.bind(this);
  }

  async setSelected(item) {
    await this.props.setSelected(item);
    this.props.navigation.navigate({ routeName: routes.Home, params: { name: item.name }  })
  }

  render() {
    const renderItem = ({ item }) => {
      return (
        <View style={ styles.listRow }>
          <TouchableHighlight
            onPress={ () => this.setSelected(item) }
          >
            <Text style={ styles.listItem }>{ item.name }</Text>
          </TouchableHighlight>
          <Button
            onPress={ () => this.props.deleteWatchList(item) }
            title={ 'Delete' }
            color={ '#FF0000' }
          />
        </View>
      )
    };
    const keyExtractor = (item, index) => index.toString();

    const addWatchList = (
      <View>
        <TextInput
          style={ styles.textInput }
          onChangeText={ (text) => this.setState({ newWatchListName: text }) }
        />
        <Button
          onPress={ () => this.props.createWatchList(this.state.newWatchListName) }
          title={ 'Add Watch List' }
          color={ '#FF0000' }
        />
      </View>
    );

    console.log(this.props.watchLists.map(({ id }) => id))
    return (
      <View>
        <FlatList
          data={ this.props.watchLists }
          renderItem={ renderItem }
          keyExtractor={ keyExtractor }
        />
        { addWatchList }
      </View>
    );
  }
};

const mapStateToProps = (state) => ({
  watchLists: state.WatchList.watchLists
});

const mapDispatchToProps = {
  createWatchList,
  deleteWatchList,
  setSelected
};

const styles = StyleSheet.create({
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
    flexGrow: 1,
    justifyContent: 'space-between',
    alignContent: 'stretch'
  },
  textInput: {
    minHeight: 30,
    borderColor: '#BBBBBB',
    borderWidth: 1
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(WatchListListScreen);