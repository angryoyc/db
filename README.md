db
-----

PostgreSQL DB-adapter (wrapper) module


Install
--------

npm install git+ssh://serg@settv.ru:1022/opt/git/db.git


Example
--------
```
db.connect(conn_string
.then({function(){
	return db.sql('select count(*) as c from user;');
})
.then({function(result){
	console.log(result.rows[0].c);
});

```
