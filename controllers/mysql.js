const mysql = require('mysql');
const connection = mysql.createConnection({
  socketPath: "/var/run/mysqld/mysqld.sock",
  user     : 'c2617_frmk_tk',
  password : 'DeSteKapzovuw17',
  database : 'c2617_frmk_tk'
});

module.exports = function(query){
	return new Promise(function(resolve, reject){
		connection.query(query, function(err, rows, fields) {
            resolve(rows);
		});
	});
	
}