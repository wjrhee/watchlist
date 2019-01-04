import WatchList from "../models/WatchList";
import Stock from "../models/Stock";
import StockLink from "../models/StockLink";
import _ from 'lodash';

export const seeder = async ({ name, tickers = [] }) => {
  const watchList = await new WatchList({ name }).save();
  const stocks = await Promise.all(tickers.map((ticker) => new Stock({ ticker }).save()));

  watchList.stocksToWatch = await Promise.all(stocks.map((stock) => {
    return new StockLink({ stock, watchList }).save();
  }));

  return watchList;
}

export const hydrate = (params) => {
  const watchListParams = _.values(params);
  const watchLists = watchListParams.map(({ name, id, stocksToWatch }) => {
    const watchList = new WatchList({ name, id });
    const stockLinks = stocksToWatch.map(({ stockId, ticker, stocksToWatchId }) => {
      const stock = new Stock({ id: stockId, ticker: ticker });
      return new StockLink({ id: stocksToWatchId, stock, watchList });
    });

    watchList.stocksToWatch = stockLinks;
    return watchList;
  });

  return watchLists;
}