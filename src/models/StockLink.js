import { SQLite } from 'expo';
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

  // save() {
  //   const db = SQLite.openDatabase('db.db');
  //   return db.transaction((tx) => {
  //     // tx.executeSql('INSERT INTO stocks (ticker) values (?)', [this.ticker])
  //     // tx.executeSql('INSERT INTO stocks (ticker) values (?)', [this.ticker])
  //     tx.executeSql('SELECT * FROM stocks WHERE ticker = ?', [this.ticker], (_, { rows }) => {
  //       if (rows.length === 0) {
  //         tx.executeSql('INSERT INTO stocks (ticker) VALUES (?)', [this.ticker])
  //       } else {
  //       }
  //     });
  //   });
  // }
}