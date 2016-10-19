db
-----

PostgreSQL DB-adapter (wrapper) module


Install
--------

npm install git+https://github.com/angryoyc/db.git




Example
--------
```
var conn_string='postgres://common:rjgthybr@127.0.0.1:6432/settv';
db.connect(conn_string)
.then({function(){
	return db.sql('select count(*) as c from user;');
})
.then({function(result){
	console.log('The total number of users: ', result.rows[0].c);
});

```

Tests
------
1. Copy ./test/config.json.example to ./test/config
2. Edit ./test/config.json end set the correct connection string and then

```
make test
```
