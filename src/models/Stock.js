import _ from 'lodash';
import q from 'q';
import { SQLite } from 'expo';

import Base from './Base';
import { tables } from '../config/constants';

export default class Stock extends Base {
  static fetchSearch(searchString) {
    const searchUrl = 'https://trade.tastyworks.com/symbol_search/search';
    if (_.isEmpty(searchString)) {
      return q.resolve([]);
    };

    return fetch(`${searchUrl}/${searchString}`)
      .then((res) => res.json())
      .then((results) => {
        const searchResults = results
          .filter((item) => _.tail(item) !== 'STOCK')
          .map((searchResult) => ({
            ticker: searchResult[0],
            name: searchResult[1]
          }));

        return searchResults;
      });
  }

  constructor({ id, ticker, watchList, stock }) {
    super({ id, tableName: tables.stocks });

    this.ticker = ticker;

    this.apiMap = {
      ticker: {
        attribute: 'ticker'
      }
    };
  }

  set ticker(ticker) {
    this._ticker = _.upperCase(ticker);
  }

  get ticker() {
    return this._ticker;
  }

  sync() {
    const db = SQLite.openDatabase('db.db');
    const deferred = q.defer();

    db.transaction((tx) => {
      tx.executeSql('SELECT id FROM stocks WHERE ticker = ?', [this.ticker], (__, { rows }) => {
        this.id = _.get(rows._array, '[0].id')
        deferred.resolve(this)
      });
    });

    return deferred.promise;
  }

  async save() {
    await this.sync()
    return Base.prototype.save.call(this);
  }

  delete() {
    const deferred = q.defer();
    deferred.reject(new Error('Cannot delete a stock'));
    return deferred.promise;
  }
}