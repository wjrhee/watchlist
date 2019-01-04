export const storage = {
  hasAlreadyLaunched: 'hasAlreadyLaunched',
  watchlists: 'watchlists',
  default: 'defaultList'
};

export const defaultList = {
  name: 'My first list',
  tickers: ['goog', 'aapl', 'msft']
};

export const tables = {
  watchLists: 'watch_lists',
  watchListsStocks: 'watch_lists_stocks',
  stocks: 'stocks'
};

export const routes = {
  Home: 'Home',
  Search: 'Search',
  Stock: 'Stock',
  WatchListList: 'WatchListList'
};

export const url = {
  iex: {
    base: 'https://api.iextrading.com/1.0/stock'
  },
  tastyworks: {
    search: 'https://trade.tastyworks.com/symbol_search/search'
  }
}

