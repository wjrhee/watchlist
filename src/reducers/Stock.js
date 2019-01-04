import {
  LOAD_CHART,
  RECEIVED_CHART,
  RECEIVED_SEARCH_RESULTS
} from '../actions/Stock';

const initialState = {
  stocks: {}
};

const stock = (state = initialState, action) => {
  switch(action.type) {
    case LOAD_CHART:
      return {
        ...state,
        isLoading: true
      }
    case RECEIVED_CHART:
      return {
        ...state,
        isLoading: false,
        chart: action.chart
      }
    case RECEIVED_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.searchResults
      }
    default:
      return { ... state }
  }
};

export default stock;