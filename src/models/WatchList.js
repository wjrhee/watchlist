import _ from 'lodash';
import q from 'q';
import { SQLite } from 'expo';

import Base from './Base';
import StockLink from './StockLink';

import { tables } from '../config/constants';

export default class WatchList extends Base {
  constructor({ id, name, stocksToWatch = [] }) {
    super({ id: id, tableName: tables.watchLists });

    this.name = name;
    this.stocksToWatch = stocksToWatch;

    this.apiMap = {
      name: {
        attribute: 'name'
      }
    };
  }

  async addStock(stock) {
    const savedStock = await stock.save();
    const stockLink = await new StockLink({ stock: savedStock, watchList: this }).save();
    this.stocksToWatch.push(stockLink);
  }

  async delete() {
    await Base.prototype.delete.call(this);
    const stockLinks = this.stocksToWatch.filter((stockLink) => !!stockLink.id);
    return Promise.all(stockLinks.map((stockLink) => stockLink.delete()));
  }

  save() {
    return Base.prototype.save.call(this).then(() => {
      const db = SQLite.openDatabase('db.db');
      const deferred = q.defer();

      db.transaction((tx) => {
        tx.executeSql(`
          SELECT *
          FROM ${tables.watchListsStocks}
          INNER JOIN ${tables.watchLists} ON ${tables.watchListsStocks}.watch_list_id = ${tables.watchLists}.id
          INNER JOIN ${tables.stocks} ON ${tables.watchListsStocks}.stock_id = ${tables.stocks}.id
          WHERE ${tables.watchLists}.id = ?
        `, [this.id], (__, { rows }) => {
          const existingStockIds = rows._array.map(({ id }) => id);
          const currentStockIds = this.stocksToWatch.map(({ id }) => id);

          const deleteRequests = existingStockIds.filter((id) => {
            return !currentStockIds.includes(id);
          }).map((id) => new StockLink({ id }).delete());

          const saveRequests = this.stocksToWatch.filter(({ id }) => {
            return !existingStockIds.includes(id);
          }).map((stockLink) => stockLink.save());

          return Promise.all([...saveRequests, ...deleteRequests])
            .then(() => {
              deferred.resolve(this)
            })
            .catch((err) => deferred.reject(err));
        });
      });

      return deferred.promise;
    });
  }

  getTickers() {
    return this.stocksToWatch.map((link) => link.ticker());
  }

  static loadAll() {
    const db = SQLite.openDatabase('db.db');
    const deferred = q.defer();
    let returnValue;

    db.transaction((tx) => {
      tx.executeSql(`
        SELECT *
        FROM ${tables.watchListsStocks}
        INNER JOIN ${tables.watchLists} ON ${tables.watchListsStocks}.watch_list_id = ${tables.watchLists}.id
        INNER JOIN ${tables.stocks} ON ${tables.watchListsStocks}.stock_id = ${tables.stocks}.id
      `, null, (__, { rows }) => {
        returnValue = _.reduce(rows._array, (acc, value) => {
          if (acc[value.watch_list_id]) {
            acc[value.watch_list_id].stocksToWatch.push({
              stockToWatchId: value.id,
              stockId: value.stock_id,
              ticker: value.ticker
            });
          } else {
            acc[value.watch_list_id] = {
              name: value.name,
              id: value.watch_list_id,
              stocksToWatch: [{
                stockToWatchId: value.id,
                stockId: value.stock_id,
                ticker: value.ticker
              }]
            };
          };

          return acc;
        }, {});
      });
    }, (err) => {
      deferred.reject(err);
    }, () => {
      deferred.resolve(returnValue);
    });

    return deferred.promise;
  }
}