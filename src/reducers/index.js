import { combineReducers } from 'redux';
import stock from './Stock';
import watchList from './WatchList';

const rootReducer = combineReducers({
  Stock: stock,
  WatchList: watchList
});

export default rootReducer;