import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TextInput, View } from 'react-native';
import Stock from '../../models/Stock';
import SearchList from './SearchList';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResults: [] };
    this.search = this.search.bind(this);
  }

  search(text) {
    Stock.fetchSearch(_.upperCase(text)).then((searchResults) => {
      this.setState({ searchResults });
    });
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder={ 'Search' }
          onChangeText={ this.search }
          style={ styles.searchInput }
        />
        <SearchList
          data={ this.state.searchResults }
          goBack={ this.props.navigation.goBack }
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  searchInput: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20
  }
})

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(SearchScreen);