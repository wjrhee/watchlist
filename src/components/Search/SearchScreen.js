import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { fetchSearch } from '../../actions/Stock';
import { FlatList, Text, TextInput, View } from 'react-native';
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
        />
        <SearchList
          data={ this.state.searchResults }
          goBack={ this.props.navigation.goBack }
        />
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return state;
}


export default connect(mapStateToProps)(SearchScreen);