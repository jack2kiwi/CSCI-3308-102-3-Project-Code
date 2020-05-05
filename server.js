/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
const session = require('express-session');
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added


app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/views'));

var sess;

//Create Database Connection
var pgp = require('pg-promise')();

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'password'
};

var db = pgp(dbConfig);

var pageList = ["/index", "/aboutUs", "/login", "/javaContent", "/algorithm", "/hello", "/comments", "/encoding", "/variables", "/conversions", "/scope", "/error", "/conditional", "/switch", "/while_loops", "/do_while", "/for_loops", "/strings", "/type_wrap", "/writing_methods", "/arrays", "/arrays_examples", "/var_args", "/2D", "/Expressions", "/Writing", "/Reading1", "/Reading2", "/Parsing", "/Tokens"];


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



app.get('/',(req,res) => {
    sess = req.session;
    if(!sess.username) {
        sess.username = "Not Signed In";
    }
    if(!sess.location){
        sess.location = 0
    }
});

/*Add your other get/post request handlers below here: */
app.get('/login', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
  res.render('pages/login',{
      username: sess.username,
      message:"",
      location: pageList[sess.location]
  });
});

app.post('/login/register', function(req, res) {
  sess = req.session;
	var usernameInput = req.body.usernameInput1;
	var passwordInput = req.body.passwordInput1;

	var newUser = "INSERT INTO users(username, password, location) VALUES('" + usernameInput + "','" + passwordInput + "', 0) ON CONFLICT DO NOTHING;";

  db.any(newUser)
        .then(function (rows) {
            res.render('pages/login',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/login', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});

app.post('/login/signin', function(req, res) {
  sess = req.session;
	var usernameInput = req.body.usernameInput2;
	var passwordInput = req.body.passwordInput2;

	var user = "SELECT * FROM users WHERE username =  '" + usernameInput + "'  AND password = '" + passwordInput + "';";

  db.any(user)
        .then(function (rows) {
            sess.username = rows[0].username;
            sess.location = rows[0].location;
            res.render('pages/login',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/login', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});

app.post('/login/setLoc', function(req, res) {
  sess = req.session;
  var loc = 2;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";


  db.any(updateUsers)
        .then(function (rows) {
            sess.location = 2;
            res.render('pages/login',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/login', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});

// registration page
app.get('/2D', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_2D";
	db.any(query)
        .then(function (rows) {
            res.render('pages/2D',{
				data: rows,
				name: "/2D/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/2D/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_2D";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_2D";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_2D(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/2D',{
				data: info[1],
				name: "/2D/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/2D/setLoc', function(req, res) {
  sess = req.session;
  var loc = 23;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_2D";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 23;
    	res.render('pages/2D',{
				data: info[1],
				name: "/2D/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/algorithm', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_algorithm";
	db.any(query)
        .then(function (rows) {
            res.render('pages/algorithm',{
				data: rows,
				name: "/algorithm/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/algorithm/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_algorithm";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_algorithm";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_algorithm(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/algorithm',{
				data: info[1],
				name: "/algorithm/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/algorithm/setLoc', function(req, res) {
  sess = req.session;
  var loc = 4;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_algorithm";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 4;
    	res.render('pages/algorithm',{
				data: info[1],
				name: "/algorithm/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/arrays_examples', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_arrays_examples";
	db.any(query)
        .then(function (rows) {
            res.render('pages/arrays_examples',{
				data: rows,
				name: "/arrays_examples/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/arrays_examples/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_arrays_examples";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_arrays_examples";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_arrays_examples(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/arrays_examples',{
				data: info[1],
				name: "/arrays_examples/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/arrays_examples/setLoc', function(req, res) {
  sess = req.session;
  var loc = 21;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_arrays_examples";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 21;
    	res.render('pages/arrays_examples',{
				data: info[1],
				name: "/arrays_examples/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/arrays', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_arrays";
	db.any(query)
        .then(function (rows) {
            res.render('pages/arrays',{
				data: rows,
				name: "/arrays/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/arrays/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_arrays";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_arrays";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_arrays(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/arrays',{
				data: info[1],
				name: "/arrays/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/arrays/setLoc', function(req, res) {
  sess = req.session;
  var loc = 20;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 20;
    	res.render('pages/arrays',{
				data: info[1],
				name: "/arrays/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/comments', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_comments";
	db.any(query)
        .then(function (rows) {
            res.render('pages/comments',{
				data: rows,
				name: "/comments/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/comments/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_comments";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_comments";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_comments(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/comments',{
				data: info[1],
				name: "/comments/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/comments/setLoc', function(req, res) {
  sess = req.session;
  var loc = 6;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_comments";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 6;
    	res.render('pages/comments',{
				data: info[1],
				name: "/comments/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/conditional', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_conditional";
	db.any(query)
        .then(function (rows) {
            res.render('pages/conditional',{
				data: rows,
				name: "/conditional/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/conditional/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_conditional";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_conditional";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_conditional(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/conditional',{
				data: info[1],
				name: "/conditional/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/conditional/setLoc', function(req, res) {
  sess = req.session;
  var loc = 12;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_conditional";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 12;
    	res.render('pages/conditional',{
				data: info[1],
				name: "/conditional/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/conversions', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_conversions";
	db.any(query)
        .then(function (rows) {
            res.render('pages/conversions',{
				data: rows,
				name: "/conversions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/conversions/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_conversions";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_conversions";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_conversion(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/conversions',{
				data: info[1],
				name: "/conversions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/conversions/setLoc', function(req, res) {
  sess = req.session;
  var loc = 9;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_conversions";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 9;
    	res.render('pages/conversions',{
				data: info[1],
				name: "/conversions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.get('/do_while', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_do_while";
	db.any(query)
        .then(function (rows) {
            res.render('pages/do_while',{
				data: rows,
				name: "/do_while/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/do_while/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_do_while";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_do_while";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_do_while(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/do_while',{
				data: info[1],
				name: "/do_while/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/do_while/setLoc', function(req, res) {
  sess = req.session;
  var loc = 15;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_do_while";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 15;
      res.render('pages/do_while',{
        data: info[1],
        name: "/do_while/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/encoding', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_encoding";
	db.any(query)
        .then(function (rows) {
            res.render('pages/encoding',{
				data: rows,
				name: "/encoding/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/encoding/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_encoding";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_encoding";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_encoding(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/encoding',{
				data: info[1],
				name: "/encoding/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/encoding/setLoc', function(req, res) {
  sess = req.session;
  var loc = 7;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_encoding";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 7;
      res.render('pages/encoding',{
        data: info[1],
        name: "/conversions/encoding",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/error', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_error";
	db.any(query)
        .then(function (rows) {
            res.render('pages/error',{
				data: rows,
				name: "/error/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/error/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_error";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_error";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_error(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/error',{
				data: info[1],
				name: "/error/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/error/setLoc', function(req, res) {
  sess = req.session;
  var loc = 11;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_error";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 11;
      res.render('pages/error',{
        data: info[1],
        name: "/error/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Expressions', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Expressions";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Expressions',{
				data: rows,
				name: "/Expressions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Expressions/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Expressions";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Expressions";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Expressions(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Expressions',{
				data: info[1],
				name: "/Expressions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Expressions/setLoc', function(req, res) {
  sess = req.session;
  var loc = 24;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Expressions";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 24;
      res.render('pages/Expressions',{
        data: info[1],
        name: "/Expressions/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/for_loops', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_for_loops";
	db.any(query)
        .then(function (rows) {
            res.render('pages/for_loops',{
				data: rows,
				name: "/for_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/for_loops/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_for_loops";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_for_loops";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_for_loops(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/for_loops',{
				data: info[1],
				name: "/for_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/for_loops/setLoc', function(req, res) {
  sess = req.session;
  var loc = 16;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_for_loops";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 15;
      res.render('pages/for_loops',{
        data: info[1],
        name: "/for_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/hello', function(req, res) {
  sess = req.session
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_hello";
	db.any(query)
        .then(function (rows) {
            res.render('pages/hello',{
				data: rows,
				name: "/hello/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/hello/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_hello";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_hello";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_hello(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/hello',{
				data: info[1],
				name: "/hello/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/hello/setLoc', function(req, res) {
  sess = req.session;
  var loc = 5;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_hello";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 5;
      res.render('pages/hello',{
        data: info[1],
        name: "/hello/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Parsing', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Parsing";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Parsing',{
				data: rows,
				name: "/Parsing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Parsing/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Parsing";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Parsing";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Parsing(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Parsing',{
				data: info[1],
				name: "/Parsing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Parsing/setLoc', function(req, res) {
  sess = req.session;
  var loc = 28;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Parsing";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 28;
      res.render('pages/Parsing',{
        data: info[1],
        name: "/Parsing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Reading1', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Reading1";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Reading1',{
				data: rows,
				name: "/Reading1/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Reading1/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Reading1";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Reading1";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Reading1(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Reading1',{
				data: info[1],
				name: "/Reading1/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Reading1/setLoc', function(req, res) {
  sess = req.session;
  var loc = 26;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Reading1";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 26;
      res.render('pages/Reading1',{
        data: info[1],
        name: "/Reading1/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Reading2', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Reading2";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Reading2',{
				data: rows,
				name: "/Reading2/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Reading2/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Reading2";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Reading2";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Reading2(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Reading2',{
				data: info[1],
				name: "/Reading2/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Reading2/setLoc', function(req, res) {
  sess = req.session;
  var loc = 27;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Reading2";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 27;
      res.render('pages/Reading2',{
        data: info[1],
        name: "/Reading2/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/scope', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_scope";
	db.any(query)
        .then(function (rows) {
            res.render('pages/scope',{
				data: rows,
				name: "/scope/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/scope/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_scope";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_scope";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_scope(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/scope',{
				data: info[1],
				name: "/scope/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/scope/setLoc', function(req, res) {
  sess = req.session;
  var loc = 10;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_scope";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 10;
      res.render('pages/scope',{
        data: info[1],
        name: "/scope/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/strings', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_strings";
	db.any(query)
        .then(function (rows) {
            res.render('pages/strings',{
				data: rows,
				name: "/strings/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/strings/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_strings";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_strings";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_strings(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/strings',{
				data: info[1],
				name: "/strings/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/strings/setLoc', function(req, res) {
  sess = req.session;
  var loc = 17;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_strings";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 17;
      res.render('pages/strings',{
        data: info[1],
        name: "/strings/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/switch', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_switch";
	db.any(query)
        .then(function (rows) {
            res.render('pages/switch',{
				data: rows,
				name: "/switch/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/switch/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_switch";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_switch";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_switch(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/switch',{
				data: info[1],
				name: "/switch/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/switch/setLoc', function(req, res) {
  sess = req.session;
  var loc = 13;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_swithc";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 13;
      res.render('pages/switch',{
        data: info[1],
        name: "/switch/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Tokens', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Tokens";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Tokens',{
				data: rows,
				name: "/Tokens/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Tokens/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Tokens";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Tokens";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Tokens(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Tokens',{
				data: info[1],
				name: "/Tokens/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Tokens/setLoc', function(req, res) {
  sess = req.session;
  var loc = 29;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Tokens";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 29;
      res.render('pages/Tokens',{
        data: info[1],
        name: "/Tokens/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/type_wrap', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_type_wrap";
	db.any(query)
        .then(function (rows) {
            res.render('pages/type_wrap',{
				data: rows,
				name: "/type_wrap/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/type_wrap/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_type_wrap";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_type_wrap";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_type_wrap(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/type_wrap',{
				data: info[1],
				name: "/type_wrap/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/type_wrap/setLoc', function(req, res) {
  sess = req.session;
  var loc = 18;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_type_wrap";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 18;
      res.render('pages/type_wrap',{
        data: info[1],
        name: "/type_wrap/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/var_args', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_var_args";
	db.any(query)
        .then(function (rows) {
            res.render('pages/var_args',{
				data: rows,
				name: "/var_args/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/var_args/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_var_args";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_var_args";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_var_args(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/var_args',{
				data: info[1],
				name: "/var_args/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/var_args/setLoc', function(req, res) {
  sess = req.session;
  var loc = 22;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_var_args";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 22;
      res.render('pages/var_args',{
        data: info[1],
        name: "/var_args/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/variables', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_variables";
	db.any(query)
        .then(function (rows) {
            res.render('pages/variables',{
				data: rows,
				name: "/variables/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/variables/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_variables";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_variables";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_variables(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/variables',{
				data: info[1],
				name: "/variables/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/variables/setLoc', function(req, res) {
  sess = req.session;
  var loc = 8;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_variables";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 8;
      res.render('pages/variables',{
        data: info[1],
        name: "/variables/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/while_loops', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_while_loops";
	db.any(query)
        .then(function (rows) {
            res.render('pages/while_loops',{
				data: rows,
				name: "/while_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/while_loops/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_while_loops";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_while_loops";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_while_loops(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/while_loops',{
				data: info[1],
				name: "/while_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/while_loops/setLoc', function(req, res) {
  sess = req.session;
  var loc = 14;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_while_loops";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 14;
      res.render('pages/while_loops',{
        data: info[1],
        name: "/while_loops/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/writing_methods', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_writing_methods";
	db.any(query)
        .then(function (rows) {
            res.render('pages/writing_methods',{
				data: rows,
				name: "/writing_methods/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/writing_methods/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_writing_methods";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_writing_methods";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_writing_methods(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/writing_methods',{
				data: info[1],
				name: "/writing_methods/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/writing_methods/setLoc', function(req, res) {
  sess = req.session;
  var loc = 19;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_writing_methods";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 19;
      res.render('pages/writing_methods',{
        data: info[1],
        name: "/writing_methods/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});

app.get('/Writing', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
	var query = "SELECT * FROM comments_Writing";
	db.any(query)
        .then(function (rows) {
            res.render('pages/Writing',{
				data: rows,
				name: "/Writing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
        })
});
app.post('/Writing/post_comments', function(req, res) {
  sess = req.session;

	var query = "SELECT * FROM comments_Writing";
	var text = req.body.text;
	var insert_statement = "SELECT * FROM comments_Writing";
	var name2 = req.body.name3;
	if (!name2){
		name2 = "Anonymous";
	}
	if (text){
		insert_statement = "INSERT INTO comments_Writing(name, post) VALUES('" + name2 + "', '" + text + "')";
	}
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(query)
        ]);
    })
    .then(info => {
    	res.render('pages/Writing',{
				data: info[1],
				name: "/Writing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
			})
    })
});

app.post('/Writing/setLoc', function(req, res) {
  sess = req.session;
  var loc = 25;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";

  var query = "SELECT * FROM comments_Writing";

  db.task('get-everything', task => {
        return task.batch([
            task.any(updateUsers),
            task.any(query)
        ]);
    })
    .then(info => {
      sess.location = 25;
      res.render('pages/Writing',{
        data: info[1],
        name: "/Writing/post_comments",
        username: sess.username,
        message:"",
        location: pageList[sess.location]
      })
    })
});


app.get('/javaContent', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
  res.render('pages/javaContent',{
      username: sess.username,
      message:"",
      location: pageList[sess.location]
  });
});

app.post('/javaContent/setLoc', function(req, res) {
  sess = req.session;
  var loc = 3;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";


  db.any(updateUsers)
        .then(function (rows) {
            sess.location = 3;
            res.render('pages/javaContent',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/javaContent', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});

app.get('/aboutUs', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
  res.render('pages/aboutUs',{
      username: sess.username,
      message:"",
      location: pageList[sess.location]
  });
});

app.post('/aboutUs/setLoc', function(req, res) {
  sess = req.session;
  var loc = 1;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";


  db.any(updateUsers)
        .then(function (rows) {
            sess.location = 1;
            res.render('pages/aboutUs',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/aboutUs', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});

app.get('/index', function(req, res) {
  sess = req.session;
  if(!sess.username) {
      sess.username = "Not Signed In";
  }
  if(!sess.location){
      sess.location = 0
  }
  res.render('pages/index',{
      username: sess.username,
      message:"",
      location: pageList[sess.location]
  });
});

app.post('/index/setLoc', function(req, res) {
  sess = req.session;
  var loc = 0;
  var updateUsers = "UPDATE users SET location =  " + loc + "  WHERE username = '" + sess.username + "';";


  db.any(updateUsers)
        .then(function (rows) {
            sess.location = 0;
            res.render('pages/index',{
              username: sess.username,
              message:"",
              location: pageList[sess.location]
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            res.render('pages/index', {
              username: sess.username,
              message:"",
              location: pageList[sess.location]
            })
        })
});


app.listen(3000);
console.log('3000 is the magic port');
