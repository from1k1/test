const user = require('./controllers/userController');
const multer = require('multer');
const mime = require('mime');
const verifyToken = require('./middleware/tokenVerify.js');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/c2617/frmk.tk/app/static/user_pics/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
  }
})
var upload = multer({storage:storage});
module.exports = function(app){
	app.get('/',upload.none(),user.signinget);
	app.post('/',upload.none(),user.signinpost);
	app.post('/signup',upload.single('avatar'),user.signup);
	app.get('/signup',upload.none(),user.signupget);
	app.get('/userlist',verifyToken.verify, user.list);
	app.get('/verify',verifyToken.verify,user.checktoken);
}