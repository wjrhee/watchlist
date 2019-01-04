import _ from 'lodash';
import { AsyncStorage } from 'react-native';

import Base from '../models/Base';
import StockLink from '../models/StockLink';
import Stock from '../models/Stock';
import WatchList from '../models/WatchList';

import { seeder, hydrate } from '../utils/seeder';

import { defaultList, storage, url } from '../config/constants';

export const ADD_STOCK = 'ADD_STOCK';
export const CREATE_NEW_WATCH_LIST = 'CREATE_NEW_WATCH_LIST';
export const LOAD_STOCKS = 'LOAD_STOCKS';
export const LOAD_WATCH_LISTS = 'LOAD_WATCH_LISTS';
export const RECEIVED_STOCKS = 'RECEIVED_STOCKS';
export const RECEIVED_WATCH_LISTS = 'RECEIVED_WATCH_LISTS';
export const RECEIVED_DEFAULT_WATCH_LIST = 'RECEIVED_DEFAULT_WATCH_LIST';
export const SEED_DEFAULT_WATCH_LIST = 'SEED_DEFAULT_WATCH_LIST';
export const SET_SELECTED_WATCH_LIST = 'SET_SELECTED_WATCH_LIST';
export const DELETE_WATCH_LIST = 'DELETE_WATCH_LIST';

const batch = `${url.iex.base}/market/batch?symbols=`
const typeQuote = `&types=quote`;

export const setupDefaultWatchList = () => {
  return async (dispatch) => {
    const hasAlreadyLaunched = await AsyncStorage.getItem(storage.hasAlreadyLaunched);

    if ((hasAlreadyLaunched == null)) {
      dispatch({ type: SEED_DEFAULT_WATCH_LIST });

      await AsyncStorage.setItem(storage.hasAlreadyLaunched, 'true');
      await Base.setupTables();

      const watchList = await seeder(defaultList);

      return dispatch({
        type: RECEIVED_DEFAULT_WATCH_LIST,
        watchLists: [watchList],
        selected: watchList
      });
    } else {
      dispatch({
        type: LOAD_WATCH_LISTS
      });

      const loadedData = await WatchList.loadAll();
      const watchLists = hydrate(loadedData);

      return dispatch({
        type: RECEIVED_WATCH_LISTS,
        watchLists: watchLists,
        selected: _.head(watchLists)
      });
    };
  };
};

export const fetchWatchLists = async () => {
  return async (dispatch) => {
    const rawWatchlists = await AsyncStorage.getItem(storage.watchlists);

    const watchLists = JSON.parse(rawWatchlists);

    return dispatch({
      type: RECEIVED_WATCH_LISTS,
      watchLists
    });
  };
};

export const addStock = (stock, watchList) => {
  return async (dispatch) => {
    const savedStock = await stock.save();
    const stockToWatch = new StockLink({ stock: savedStock, watchList });
    watchList.stocksToWatch.push(stockToWatch);
    const savedWatchList = await watchList.save();

    await dispatch({
      type: ADD_STOCK,
      watchList: savedWatchList
    });

    return dispatch(fetchStocks(savedWatchList))
  }
}

export const fetchStocks = (watchList) => {
  return async (dispatch) => {
    if (!watchList) {
      return dispatch({
        type: RECEIVED_STOCKS,
        stocks: {}
      });
    }

    dispatch({ type: LOAD_STOCKS })
    const tickers = watchList.getTickers();

    if (_.isEmpty(tickers)) {
      return dispatch({
          type: RECEIVED_STOCKS,
          stocks: {}
      });
    }

    const rawData = await fetch(`${batch}${tickers}${typeQuote}`);
    const rawStocks = await rawData.json();
    const stocks = _.transform(rawStocks, (acc, { quote }, key) => {
      acc[_.upperCase(key)] = {
        ticker: _.upperCase(key),
        bidPrice: quote.iexBidPrice,
        askPrice: quote.iexAskPrice,
        lastPrice: quote.latestPrice
      };

      return acc;
    }, {});

    return dispatch({
      type: RECEIVED_STOCKS,
      stocks
    });
  }
};

export const createWatchList = (name) => {
  return async (dispatch) => {
    const newWatchList = await new WatchList({ name }).save();

    return dispatch({
      type: CREATE_NEW_WATCH_LIST,
      watchList: newWatchList
    });
  };
};

export const setSelected = (watchList) => {
  return async (dispatch) => {
    await dispatch({
      type: SET_SELECTED_WATCH_LIST,
      selected: watchList
    });

    return dispatch(fetchStocks(watchList));
  };
};

export const deleteWatchList = (watchList) => {
  return async (dispatch, getState) => {
    await watchList.delete();
    const watchLists = getState().WatchList.watchLists;
    const newWatchLists = watchLists.filter(({ id }) => id !== watchList.id);
    const newSelected = newWatchLists[0];

    await dispatch({
      type: DELETE_WATCH_LIST,
      watchLists:  newWatchLists
    });

    return dispatch(setSelected(newSelected))
  };
};

export const deleteStockByTicker = (ticker) => {
  return async (dispatch, getState) => {
    const stock = await new Stock({ ticker }).sync();
    const selected = getState().WatchList.selected;
    selected.stocksToWatch = selected.stocksToWatch.filter((stockToWatch) => {
      return stockToWatch.stock.id !== stock.id
    });

    await selected.save();

    return dispatch(fetchStocks(selected));
  }
}