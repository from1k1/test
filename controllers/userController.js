const query = require('./mysql')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
exports.checktoken = function(req,res,next){
	res.send({success:true,message:"JWT Verified"});
}
exports.signinpost = function(req,res,next){
	if (!req.body){
		console.log('first if');
		res.send({
			success:false,
			message: "NO POST DATA"
		})
	}else{
		if(req.body.login && req.body.password){
			console.log('second if');
			const login = req.body.login;
			const pass = req.body.password;
			signinUser(login,pass).then(result=>{
				res.redirect(301, `http://localhost:3000/redirect.html?id=${result.id}&token=${result.token}`);
			});
		}else{
			res.send({
				success:false,
				message: "post data not correct"
			})
		}
		
	}
}
exports.signinget = function(req,res,next){
	res.sendFile('/home/c2617/frmk.tk/app/static/html/login-page.html');
}
exports.list = function(req,res,next){
	getUserList().then(result=>{
		res.send({success:true,data:result});
	});
}
exports.signupget = function(req,res,next){
	res.sendFile('/home/c2617/frmk.tk/app/static/html/signup-page.html');
}
exports.signup = function(req,res,next){
	const login = req.body.login;
	const password = req.body.password;
	const pic = req.file!==undefined ? req.file.filename : "no-image.png";
	checkUserNotExist(login).then(result=>{
		console.log("User exist: " + result);
		if(result){
			res.send({
				"success":false,
				"message":"User uzhe est tut!"
			})
		}else{
			addUser(login,password,pic).then(result=>{
				
				signinUser(login,password).then(result=>{
					console.log(result);
					if (result){
						console.log("____________AFTER SIGN IN _________");
						res.redirect(301, `http://localhost:3000/redirect.html?id=${result.id}&token=${result.token}`);
					}else{
						res.send({
							"success":false,
							"message":"User ne sozdan!"
						})
					}
				}
				
				);
			})
		}
	});
	
}

function checkUserNotExist(login){
	return new Promise((res,rej)=>
	query(`SELECT * FROM \`users\` WHERE login = '${login.toLowerCase()}'`)
	.then(
		result=>{
			console.log("DB SELECT: " + result);
			res((JSON.stringify(result)!=='[]'))
		}
	));
}

function addUser(login,password,picture){
	return new Promise(
		(res,rej)=>{
			query(`
				INSERT INTO \`users\` (login,password,profile_pic) 
				VALUES ('${login}','${password}','${picture}')`
			)
			.then(
				result=>res(true)
			).catch(
				err=>(res(false))
			)
		}
	);
}

async function signinUser(login,password){
	const rows = await query(`SELECT \`id\` FROM \`users\` WHERE \`login\` = '${login}' AND  \`password\`= '${password}'`);
	const userId = Object.assign({},rows[0]).id;
	console.log("User ID: " + userId);
	var token = jwt.sign({ id: userId,login:login }, "SUPADUPASECRET", {
      expiresIn: 86400 // expires in 24 hours
    });
    const tokeRows = await query(`
    INSERT INTO \`sessions\` (\`token\`, \`userid\`)
    VALUES ('${token}','${userId}')
    ON DUPLICATE KEY UPDATE token='${token}'
    `);
	console.log({id:userId,token:token});
	return {
		id: userId,
		token: token
	}
}

async function getUserList(){
	const rows = await query(`SELECT \`login\`,\`profile_pic\` FROM \`users\` WHERE 1`);
	rows.forEach(el=>{
		el.profile_pic = "https://node.black-d.ga/static/user_pics/" + el.profile_pic;
	});
	const usersArray = rows;
	return usersArray;
}