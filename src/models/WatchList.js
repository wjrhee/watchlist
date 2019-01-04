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
          FROM watch_lists_stocks
          INNER JOIN watch_lists ON watch_lists_stocks.watch_list_id = watch_lists.id
          INNER JOIN stocks ON watch_lists_stocks.stock_id = stocks.id
          WHERE watch_lists.id = ?
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

  static setupTables() {
    const deferred = q.defer();
    const db = SQLite.openDatabase('db.db');
    db.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS watch_lists (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT
        );
      `)

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS stocks (
          id INTEGER PRIMARY KEY NOT NULL,
          ticker TEXT UNIQUE
        );
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS watch_lists_stocks (
          id INTEGER PRIMARY KEY NOT NULL,
          watch_list_id INTEGER,
          stock_id INTEGER,
          FOREIGN KEY (watch_list_id) REFERENCES watch_lists(id),
          FOREIGN KEY (stock_id) REFERENCES stocks(id)
        );
      `);

      tx.executeSql('select name from sqlite_master', [], (a,b) => {
        console.log('TABLES');
        console.log(b);
      })
    }, (a,b) => {
      console.log(a);
    }, (a,b) => {
      console.log('successfully created tables');
      deferred.resolve(true)
    });
    return deferred.promise;
  }

  static destroyTables() {
    const db = SQLite.openDatabase('db.db');
    return db.transaction((tx) => {
      tx.executeSql('DROP TABLE IF EXISTS watch_lists')
      tx.executeSql('DROP TABLE IF EXISTS stocks')
      tx.executeSql('DROP TABLE IF EXISTS watch_lists_stocks')
      tx.executeSql('DROP TABLE IF EXISTS tickers')
      tx.executeSql('DROP TABLE IF EXISTS watch_lists_tickers')
      tx.executeSql('select name from sqlite_master', [], (a,b) => {
        console.log('WIPE OUT DATABASE');
        console.log(b);
      })
    });
  }
}