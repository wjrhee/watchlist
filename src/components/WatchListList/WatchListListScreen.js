import React from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
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
            style={ styles.listItem }
          >
            <Text
              numberOfLines={ 1 }
              style={ styles.listItemText }
            >
              { item.name }
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={ () => this.props.deleteWatchList(item) }
            style={ styles.delete }
          >
            <Text>DELETE</Text>
          </TouchableHighlight>
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
          color={ '#AAAAAA' }
        />
      </View>
    );

    return (
      <View style={ styles.listContainer }>
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
  delete: {
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 60
  },
  listContainer: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  listRow: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexWrap: 'nowrap',
    minHeight: 40,
    paddingTop: 5,
    paddingBottom: 5
  },
  listItem: {
    flexGrow: 1
  },
  listItemText: {
    fontSize: 18,
    flexGrow: 1,
    maxWidth: Dimensions.get('window').width - (60 + 20 + 20 + 10),
    justifyContent: 'space-between',
    alignContent: 'stretch'
  },
  textInput: {
    minHeight: 30,
    borderColor: '#BBBBBB',
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(WatchListListScreen);