import _ from 'lodash';
import { SQLite } from 'expo';
import q from 'q';
// import hydrate from '../utils/seeder';

export default class Base {
  constructor({ id, tableName }) {
    this.id = id;
    this.tableName = tableName;
  }

  delete() {
    const deferred = q.defer();
    const db = SQLite.openDatabase('db.db');
    db.transaction((tx) => {
      const deleteQuery = this._buildDeleteQuery();
      tx.executeSql(deleteQuery, [this.id]);
    }, (err) => {
      deferred.reject(err);
    }, (err) => {
      deferred.resolve(this);
    });

    return deferred.promise;
  }

  buildValues() {
    return _.map(_.values(this.apiMap), ({ attribute, relationship }) => {
      return relationship ? this[attribute].id : this[attribute]
    });
  }

  save() {
    const deferred = q.defer();
    const values = this.buildValues();
    const db = SQLite.openDatabase('db.db');

    if (this.id === undefined) {
      let id;
      db.transaction((tx) => {
        const insertQuery = this._buildInsertQuery();
        tx.executeSql(insertQuery, values, (_, { insertId }) => {
          id = insertId;
        });

      }, (err) => {
        deferred.reject(err);
      }, () => {
        this.id = id;
        deferred.resolve(this);
      });
    } else {
      db.transaction((tx) => {
        const updateQuery = this._buildUpdateQuery();
        tx.executeSql(updateQuery, values);
      }, (err) => {
        deferred.reject(err);
      }, () => {
        deferred.resolve(this);
      });
    }

    return deferred.promise;
  }

  create(params) {
    if (this.id === null) {
      const db = SQLite.openDatabase('db.db');
      return db.transaction((tx) => {
        const insertQuery = this._buildInsertQuery(_.keys(params));
        tx.executeSql(insertQuery, lodsah.values(params))
      });
    }
  }

  update(attributes) {
    const db = SQLite.openDatabase('db.db');
    return db.transaction((tx) => {
      // const updateQuery = this._buildUpdateQuery(attributes);
      // tx.executeSql(`UPDATE ${this.tableName} SET `, [this.ticker])
    });
  }

  fetch() {
    const deferred = q.defer();
    const db = SQLite.openDatabase('db.db');
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM watch_lists', [], (a,b) => {
        console.log(b);
      })
    })

  }

  _buildInsertQuery() {
    const properties = _.keys(this.apiMap);
    const queryPart = Array(properties.length).fill('?').join(',');
    return `INSERT INTO ${this.tableName} (${properties}) VALUES (${queryPart})`;
  }

  _buildUpdateQuery() {
    const queryPart = _.keys(this.apiMap).map((property) => `${property} = ?`).join(',');
    return `UPDATE ${this.tableName} SET ${queryPart} WHERE id = ${this.id}`
  }

  _buildDeleteQuery() {
    return `DELETE FROM ${this.tableName} WHERE id = ?`;
  }

  static loadAll() {
    const db = SQLite.openDatabase('db.db');
    const deferred = q.defer();
    let returnValue;

    db.transaction((tx) => {
      tx.executeSql(`
        SELECT *
        FROM watch_lists_stocks
        INNER JOIN watch_lists ON watch_lists_stocks.watch_list_id = watch_lists.id
        INNER JOIN stocks ON watch_lists_stocks.stock_id = stocks.id
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