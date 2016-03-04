#!/usr/local/bin/node
var db=require('../db');
var should = require('should');
describe('DB', function(){

	describe('connect method', function(){
		it('should return db object wich ready for query', function(done){
			db.connect('postgres://common_utf:rjgthybr@127.0.0.1/settv')
			.then(
				function(result){
					should(result.readyForQuery).eql(true);
					done();
				},
				function(err){
					console.log(err);
					done();
				}
			).catch(done);
		})
	});

	describe('SQL method (aka sql)', function(){
		it('should return sql result', function(done){
			db.sql('select count (*) as c from user;', [])
			.then(
				function(result){
					should(result.rows.length).above(0);
					done();
				},
				function(err){
					console.log(err);
					done();
				}
			).catch(done);
		})
		it('should return error', function(done){
			db.sql('select count r  (*) as c from user;', [])
			.then(
				function(result){
					done();
				},
				function(err){
					should(err).Error;
					done();
				}
			).catch(done);
		})
	});


	describe('new method', function(){
		it('should return db object which ready for query', function(done){
			db.new('postgres://postgres:jlyfrj@127.0.0.1/settv_rest')
			.then(
				function(result){
					should(result.readyForQuery).eql(true);
					done();
				},
				function(err){
					//console.log(err);
					done(err);
				}
			).catch(done);
		})
		it('test should return records number', function(done){
			db.new('postgres://postgres:jlyfrj@127.0.0.1/settv')
			.then(
				function(db1){
					should(db1.readyForQuery).eql(true);
					db1.new('postgres://postgres:jlyfrj@127.0.0.1/settv_rest')
					.then(
						function(db2){
							db1.sql("select count(*) as c from cmmnt;", [], 
								function(result){
									should.exist(result.rows[0]);
									done();
								}, done
							);
						}, done
					).catch(done);
				}, done
			).catch(done);
		})
	});
});



