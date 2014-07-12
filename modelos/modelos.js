//SOLUCION EJERCICIO modulos

var Sequelize = require("sequelize");

var sequelize = new Sequelize("database", "usuario", "password", {
	dialect : "sqlite",
	storage : __dirname + "/database.db",
	port : 3306,
	define : {
		timestamps : false,
		freeseTableName : true
	}
});

//COMO SE HACE EN TODOS LOS LENGUAJES
// var archivoFinal = obtenerArchivo("ruta");

//EN NODE.JS SE HACE:
//LA SIGUIENTE LINEA SE EJECUTA DE MANERA ASINCRONA
//fs.obtenerArchivo(function(){});

module.exports.configurar = function(callback) {
	//COMO LA CONSULTA DE ARCHIVOS ES ASINCRONA
	//--con CALLBACKS
	//--con PROMESAS
	//PROMESA: cuando se invoca una sentencia 'authenticate' (de manera asíncrona), nos regresa un objeto de javascript
	sequelize.authenticate().complete(callback);
	console.log("modelos configurados");
};

//MAPEO DE TABLA A OBJETO
//Definición de un objeto que permite manipular la tabla por sequelize
var Articulo = sequelize.define("Articulo", {
	id : {
		//Le decimos que esta columna es la llave primaria
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	titulo : Sequelize.TEXT,
	contenido : Sequelize.TEXT,
	fecha_creacion : Sequelize.DATE
}, {
	tableName : "articulos"
});

//HACEMOS VISIBLE EL MODELO ASOCIADO A LA TABLA
module.exports.Articulo = Articulo;

//MAPEO DE TABLA A OBJETO
//Definición de un objeto que permite manipular la tabla por sequelize
var Usuario = sequelize.define("Usuario", {
	id : {
		//Le decimos que esta columna es la llave primaria
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	nombre : Sequelize.TEXT,
	email : Sequelize.TEXT,
	password : Sequelize.TEXT
}, {
	tableName : "usuarios"
});

//HACEMOS VISIBLE EL MODELO ASOCIADO A LA TABLA
module.exports.Usuario = Usuario;

var Categoria = sequelize.define("Categoria", {
	id : {
		//Le decimos que esta columna es la llave primaria
		primaryKey : true,
		type : Sequelize.INTEGER
	},
	nombre : Sequelize.TEXT
}, {
	tableName : "categorias"
});

module.exports.Categoria = Categoria;

//Mapeo 1-N entre usuarios y artículos
//Usuario y Artículo son modelos de Sequelize
Usuario.hasMany(Articulo, {
	foreignKey : "usuario_id",
	//'as' me permite acceder a los artículos del usuario haciendo usuario.articulos
	as : "articulos"
});

var Comentario = sequelize.define("Comentario", {
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true
	},
	comentario : Sequelize.TEXT,
	autor : Sequelize.TEXT,
	fecha_creacion : Sequelize.TEXT
}, {
	tableName : "comentarios"
});

module.exports.Comentario = Comentario;

Articulo.hasMany(Comentario, {
	foreignKey : "articulo_id",
	as : "comentarios"
});

//DEFINIR MAPEOS N-N

Articulo.hasMany(Categoria, {
	foreignKey : "articulo_id",
	as : "categorias",
	//Esto es solo para N-N
	through : "categorias_articulos"
});

Categoria.hasMany(Articulo, {
	foreignKey : "categoria_id",
	as : "articulos",
	//Esto es solo para N-N
	through : "categorias_articulos"
});
