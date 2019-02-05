const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
exports.verify = function (req, res, next) {
	try{
		token = req.headers.authorization;
		console.log("GETTED TOKEN:" + token);
		const decoded = jwt.verify(token, 'SUPADUPASECRET');
		next();
	}catch(err){
		res.send({success:false,err});
	}
}