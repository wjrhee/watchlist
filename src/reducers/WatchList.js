import _ from 'lodash';
import {
  ADD_STOCK,
  CREATE_NEW_WATCH_LIST,
  DELETE_WATCH_LIST,
  LOAD_STOCKS,
  LOAD_WATCH_LISTS,
  RECEIVED_WATCH_LISTS,
  RECEIVED_DEFAULT_WATCH_LIST,
  RECEIVED_STOCKS,
  SEED_DEFAULT_WATCH_LIST,
  SET_SELECTED_WATCH_LIST
} from '../actions/WatchList';

const initialState = {
  watchLists: []
};

const watchList = (state = initialState, action) => {
  switch(action.type) {
    case CREATE_NEW_WATCH_LIST:
      return {
        ...state,
        watchLists: [...state.watchLists, action.watchList]
      };
    case DELETE_WATCH_LIST:
      // const newWatchLists = [...state.watchLists].filter(({ id }) => id !== action.watchListId);
      // const newSelected = newWatchLists[0];
      return {
        ...state,
        watchLists: action.watchLists
      };
    case SEED_DEFAULT_WATCH_LIST:
      return {
        ...state,
        isLoading: true
      };
    case RECEIVED_DEFAULT_WATCH_LIST:
      return {
        ...state,
        selected: action.selected,
        watchLists: action.watchLists,
        isLoading: false
      };
    case LOAD_WATCH_LISTS:
      return {
        ...state,
        isLoading: true
      };
    case RECEIVED_WATCH_LISTS:
      return {
        ...state,
        isLoading: false,
        selected: state.selected || action.watchLists[0],
        watchLists: action.watchLists
      };
    case ADD_STOCK:
      const newList = [...state.watchLists];
      const index = _.findIndex(newList, { id: action.watchList.id });
      newList[index] = action.watchList;

      return {
        ...state,
        reloaded: true,
        watchLists: newList,
        selected: action.watchList
      }
    case RECEIVED_STOCKS:
      return {
        ...state,
        isLoading: false,
        stocks: action.stocks
      };
    case SET_SELECTED_WATCH_LIST:
      return {
        ...state,
        selected: action.selected
      }
    case LOAD_STOCKS:
      return {
        ...state,
        isLoading: true
      }
    default:
      return state;
  }
};

export default watchList;