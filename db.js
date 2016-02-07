module.exports = new db();
/** @module media
 * @name db
 * @author Serg A. Osipov
 * @email serg.osipov@gmail.com
 * @overview Module for make DB-connection and use it
 */
'use strict';

var pg = require('pg');
var cf = require('cf');
var pool={};


function db(){

	var self = this;
	var conString;
	var client;

	this.readyForQuery=false;

	var getClient = function(cs){
		client=client || new pg.Client(cs);
		return (client);
	};

	var clearClient = function(){
		if(self.readyForQuery){
			var hash = cf.md5(cs);
			if(hash in pool) delete pool[hash];
		}
		client = client || new pg.Client(conString);
		client.end();
		client = null;
	};

	var sql = function (){
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

	this.new = function(cs){
		var d = new db();
		if(cs){
			return d.connect(cs);
		}else{
			return d;
		};
	};
	
	

	this.connect = function(){
		return cf.asy(arguments, function(connectionstring, resolve, reject){
			var hash = cf.md5(connectionstring);

//			console.log('connect method: current CS: ', conString);

			if(self.readyForQuery) clearClient();
			if(hash in pool){
				resolve(pool[hash]);
			}else{
				var dbclient=getClient(connectionstring);
				dbclient.connect(function(err){
					if(err){
						self.readyForQuery = false;
						clearClient();
						reject(err);
					}else{
						pool[hash] = self;
						conString = connectionstring;
//						console.log('Connected to ', connectionstring);
						self.readyForQuery = true;
						resolve(self);
					};
				});
			};
		});
	};

	this.sql = sql;
	this.SQL = sql;

	this.print=function(){
		console.log(conString);
	};
};