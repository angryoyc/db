/** @module media
 * @name db
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Module for make DB-connection and use it
 */

//var pg = require('pg').native;
var pg = require('pg');
var cf = require('cf');
var RSVP = require('rsvp');
var client;

module.exports = {
/**
 * Вернуть объект "клиент" 
 * @param  {string} conString Строка подключения
 * @return {object}           Клиент
 */
	getClient: function(conString){
		client=client || new pg.Client(conString);
		return (client);
	},

/**
 * Сбросить клиента
 * @return {undefined} 
 */
	clearClient: function(){
		client=client || new pg.Client(conString);
		client.end();
	},

/**
 * Установить соединение с базой, используя строку подключения connectionstring 
 * @param  {object}		connectionstring Объект, описывающий параметры подклчюения (свойство connectionstring)
 * @return {object}		Клиент
 */
	connect: function(){
		return cf.asy(arguments, function(connectionstring){
			var dbclient=module.exports.getClient(connectionstring, resolve, reject);
			dbclient.connect(function(err){
				if(err){
					dbclient.end();
					module.exports.clearClient();
					reject(err);
				}else{
					resolve(dbclient);
				};
			});
		})
	},

/**
 * Выполнение SQL-запроса с возвратом результатов через callback
 * @param  {str} 			SQL-запрос
 * @param  {Array} 			values	Список параметров
 * @param  {function}		onok 	Callback вызываемый при успешном выполнении запроса. Параметр - результат выполнения.
 * @param  {function}		onerr 	Callback вызываемый при возникновении ошибки. Параметр - ошибка.
 * @return {undefined}        
 */
	sql: sql,

/**
 * Выполнение SQL-запроса с возвратом результатов через promise
 * @param 	{String}		sql		SQL-запрос
 * @param 	{Array} 		values	Список параметров
 * @return 	{Promise}		Промайс-объект, resolve-метод, который получит на вход результат выполнения запроса.
 */
	SQL: sql
};

function sql(){
	return cf.asy(arguments, function(sql, values, resolve, reject){
		client.query(sql, values, function(err, result){
			if(err){
				err.sql=sql;
				err.values=values;
				reject(err);
			}else{
				resolve(result);
			};
		});
	});
};

/*
function(sql, values, onok, onerr){
		client.query(sql, values, function(err, result){
			if(err){
				err.number=103;
				err.sql=sql;
				err.values=values;
				if(typeof(onerr)=='function'){
					onerr(err);
				};
			}else{
				onok(result);
			};
		});
	}
*/