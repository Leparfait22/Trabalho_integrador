const express = require('express');
const cors = require('cors');
const moment = require('moment');



const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const pgp = require("pg-promise")({});

const usuario = "breja";
const senha = "breja";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/breja`);


const app = express();
app.use(cors())
app.use(express.json())
app.use(
	session({
		secret: 'alguma_frase_muito_doida_pra_servir_de_SECRET',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	}),
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{
			usernameField: "cpf",
			passwordField: "password",
		},
		async (cpf, password, done) => {
			try {
				// busca o usuário no banco de dados
				const user = await db.oneOrNone(
					"SELECT * FROM usuarios WHERE cpf = $1;",
					[cpf],
				);

				// se não encontrou, retorna erro
				if (!user) {
					return done(null, false, { message: "Usuário incorreto." });
				}

				// verifica se o hash da senha bate com a senha informada
				const passwordMatch = await bcrypt.compare(
					password,
					user.senhaUser,
				);

				// se senha está ok, retorna o objeto usuário
				if (passwordMatch) {
					console.log("Usuário autenticado!");
					return done(null, user);
				} else {
					// senão, retorna um erro
					return done(null, false, { message: "Senha incorreta." });
				}
			} catch (error) {
				return done(error);
			}
		},
	),
);


passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "alguma_frase_muito_doida_pra_servir_de_SECRET",
		},
		async (payload, done) => {
			try {
				const user = await db.oneOrNone(
					"SELECT * FROM users WHERE cpf = $1;",
					[payload.cpf],
				);

				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (error) {
				done(error, false);
			}
		},
	),
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			cpf: user.cpf,
			username: user.nomeUser,
		});
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const requireJWTAuth = passport.authenticate("jwt", { session: false });


app.listen(3001, () => console.log("Servidor rodando na porta 3001 "))

app.get("/", (req, res) => {
	res.send("Ola eu estou aqui ")
})

app.get("/Categorias", async (req, res) => {
	try {
		const categorias = await db.any("SELECT * FROM categorias;");
		console.log('Retornando todos categorias.');

		console.log(categorias);

		res.json(categorias).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);

	}
})


app.get("/CategoriasCerveja", async (req, res) => {
	try {
		const categorias = await db.any("SELECT * FROM produtos where idcate=1;");
		console.log('Retornando todos categorias.');

		console.log(categorias);

		res.json(categorias).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);

	}
})

app.get("/CategoriasVinho", async (req, res) => {
	try {
		const categorias = await db.any("SELECT * FROM produtos where idcate=2;");
		console.log('Retornando todos categorias.');

		console.log(categorias);

		res.json(categorias).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);

	}
})
app.get("/CategoriasDistilhado", async (req, res) => {
	try {
		const categorias = await db.any("SELECT * FROM produtos where idcate=3;");
		console.log('Retornando todos categorias.');

		console.log(categorias);

		res.json(categorias).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);

	}
})
app.get("/CategoriasNaoAlcoolico", async (req, res) => {
	try {
		const categorias = await db.any("SELECT * FROM produtos where idcate=4;");
		console.log('Retornando todos categorias.');

		console.log(categorias);

		res.json(categorias).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);

	}
})


app.post(
	"/Login",
	passport.authenticate("local", { session: false }),
	(req, res) => {
		console.log("chegou aqui ")
		// Cria o token JWT
		const token = jwt.sign({ cpf: req.body.cpf }, "your-secret-key", {
			expiresIn: "1h",
		});
		console.log("token", token)

		res.json({ message: "Login successful", token: token });
	},
);


const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../frontend/src/assets'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload-imagem', upload.single('imagem'), (req, res) => {
  const caminhoImagem = path.join(__dirname, '../frontend/src/assets', req.file.originalname);
  res.send('Imagem enviada com sucesso!');
});


app.post("/CadastrarUsusuario", async (req, res) => {
	const saltRounds = 10;

	try {
		const nomeUser = req.body.nomeUser;
		const senhaUser = req.body.senhaUser;
		const cpfUser = req.body.cpfUser;
		const emailUser = req.body.emailUser;
		const dataNascUser = req.body.dataNascUser;
		const telefoneUser = req.body.telefoneUser;
		const funcaoUser = req.body.funcaoUser;

		const salt = bcrypt.genSaltSync(saltRounds);
		const hashedPasswd = bcrypt.hashSync(senhaUser, salt);

		console.log(`Nome: ${nomeUser} - Passwd: ${hashedPasswd} -cpf: ${cpfUser} -email: ${emailUser} -telefone : ${telefoneUser} -Data de nascimento: ${dataNascUser}- Funcaouser: ${funcaoUser}`);

		//   db.none("INSERT INTO Usuarios  (user_id, user_password) VALUES ($1, $2);", [
		//   	userEmail,
		//   	hashedPasswd,
		//   ]);

		  db.none("INSERT INTO Usuarios (cpf, nomeUser, emailUser, senhaUser, funcaoUser, telefoneUser, dtnascUser) VALUES ($1, $2, $3, $4, $5, $6, $7);",
		  	[
		  		cpfUser,
		  		nomeUser,
		  		emailUser,
		  		hashedPasswd,
		  		funcaoUser,
		  		telefoneUser,
		  		dataNascUser,

		  	]);


		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});



// app.get("/clientes", requireJWTAuth, async (req, res) => {
// 	try {
// 		const clientes = await db.any("SELECT * FROM clientes;");
// 		console.log("Retornando todos clientes.");
// 		res.json(clientes).status(200);
// 	} catch (error) {
// 		console.log(error);
// 		res.sendStatus(400);
// 	}
// });
