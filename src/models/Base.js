import _ from 'lodash';
import q from 'q';
import { SQLite } from 'expo';
import { tables } from '../config/constants';

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
    }, () => {
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

  static setupTables() {
    const deferred = q.defer();
    const db = SQLite.openDatabase('db.db');
    db.transaction((tx) => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${tables.watchLists} (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT
        );
      `)

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${tables.stocks} (
          id INTEGER PRIMARY KEY NOT NULL,
          ticker TEXT UNIQUE
        );
      `);

      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${tables.watchListsStocks} (
          id INTEGER PRIMARY KEY NOT NULL,
          watch_list_id INTEGER,
          stock_id INTEGER,
          FOREIGN KEY (watch_list_id) REFERENCES ${tables.watchLists}(id),
          FOREIGN KEY (stock_id) REFERENCES ${tables.stocks}(id)
        );
      `);
    }, (err) => {
      console.log(err);
    }, () => {
      deferred.resolve(true)
    });
    return deferred.promise;
  }

  static destroyTables() {
    const db = SQLite.openDatabase('db.db');
    return db.transaction((tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS ${tables.watchLists}`);
      tx.executeSql(`DROP TABLE IF EXISTS ${tables.stocks}`);
      tx.executeSql(`DROP TABLE IF EXISTS ${tables.watchListsStocks}`);
    });
  }
}