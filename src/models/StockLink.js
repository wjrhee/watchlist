import Base from './Base';
import { tables } from '../config/constants';

export default class StockLink extends Base {
  constructor({ id, watchList, stock }) {
    super({ id, tableName: tables.watchListsStocks });

    this.watchList = watchList;
    this.stock = stock;

    this.apiMap = {
      watch_list_id: {
        attribute: 'watchList',
        relationship: true
      },
      stock_id: {
        attribute: 'stock',
        relationship: true
      }
    };
  }

  ticker() {
    return this.stock.ticker;
  }
}