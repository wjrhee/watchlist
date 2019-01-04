import _ from 'lodash';
import { createStackNavigator, createAppContainer } from "react-navigation";
import WatchListScreen from './WatchListScreen';
import WatchListListScreen from './WatchListList/WatchListListScreen';
import StockScreen from "./Stock/StockScreen";
import SearchScreen from './Search/SearchScreen';
import { routes } from '../config/constants';

const AppNavigator = createStackNavigator({
  [routes.Home]: {
    screen: WatchListScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${_.startCase(_.get(navigation.state.params, 'name'))}`
    })
  },
  [routes.Stock]: {
    screen: StockScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${_.get(navigation.state.params.stock, 'ticker')}`
    })
  },
  [routes.Search]: {
    screen: SearchScreen,
    navigationOptions: () => ({
      title: 'Search'
    })
  },
  [routes.WatchListList]: {
    screen: WatchListListScreen,
    navigationOptions: () => ({
      title: 'Select Watch List'
    })
  }
}, {
  initialRouteName: 'Home',
  headerLayoutPreset: 'center'
});

export default createAppContainer(AppNavigator);