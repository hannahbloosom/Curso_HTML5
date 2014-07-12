/*module.exports = DEFINIR UN MODULO*/
var modelos = require("../modelos/modelos.js");
/*module.exports = DEFINIR UN MODULO*/
module.exports.CONSTANTE1 = "valor1";

module.exports.configurar = function(app) {

	function mostrarInicio(request, response, nombreVista) {

		//response.send("bienvenido");
		response.render(nombreVista, {
			saludo : "Saludo dinamico",
			parametro2 : "otro valor"
		});
	}

	//
	function mostrarBlog(request, response, nombreVista) {

		var criteriosBusqueda = {};
		var limite = request.query.limite;
		var offset = request.query.offset;

		//TYPEOF: para saber el tipo de dato del objeto
		if ( typeof limite !== "undefined") {
			//si el query string limite trae datos, de los pegamos a los criterios de búsqueda
			criteriosBusqueda.limit = limite;
		}

		if ( typeof offset !== "undefined") {
			//si viene en el query string el parametro offset, lo agregamos al criterio de búsqueda
			criteriosBusqueda.offset = offset;
		}
		//AQUI SUPUESTAMENTE YA CONSULTAMOS UNA BASE DE DATOS
		//OBTENEMOS UN ARREGLO DE RESULTADOS
		modelos.Articulo.findAll(criteriosBusqueda).success(function(articulos) {
			//Cuando usamos findAll, el método regresa un arreglo de Javascript
			modelos.Categoria.findAll().success(function(categorias) {
				response.render(nombreVista, {
					//ASIGNAMOS LA VARIABLE ARTICULOS a articulos
					articulos : articulos,
					categorias : categorias
				});
			});
		});

	}


	app.get("/", function(request, response) {
		mostrarInicio(request, response, "index.html");
	});

	app.get("/inicio-contenido", function(request, response) {
		mostrarInicio(request, response, "index-contenido.html");
	});

	app.get("/blog", function(request, response) {
		mostrarBlog(request, response, "blog.html");
	});

	app.get("/blog-contenido", function(request, response) {
		mostrarBlog(request, response, "blog-contenido.html");
	});

	app.get("/contacto", function(request, response) {
		response.render("contacto.html");
	});

	app.get("/contacto-contenido", function(request, response) {
		response.render("contacto-contenido.html");
	});

	//HTTP TIENE GET, POST, TRACE, PUT, DELETE
	//GET ENVIA LOS DATOS EN LA CABEZERA DEL PAQUETE (tam limitado)
	//POST ENTIVA LOS DATOS EN EL CUERPO DEL PAQUETE HTTP (muchoos datos!!)
	//WIRESHARK PERMITE LEER EL CONTENIDO DE LOS PAQUETES :(
	//PARA EVITAR QUE NOS ROBEN INFORMACION USAMOS HTTPS

	app.post("/suscribir", function(request, response) {

		//REQUEST = ES PARA RECIBIR DATOS DEL USUARIO
		//RESPONSE = ES PARA ENVIAR UNA RESPUESTA AL USAURIO
		var email = request.body.email;

		response.send("se suscribio el email:" + email);

	});

	app.post("/contactar", function(request, response) {

		var email = request.body.email;
		var nombre = request.body.nombre;
		var url = request.body.url;
		var edad = request.body.edad;
		var comentario = request.body.comentario;

		var mensaje = "email:" + email + ", nombre:" + nombre + ",url:" + url + ",edad:" + edad + ",comentario:" + comentario;

		response.send(mensaje);

	});

	app.get("/chat", function(request, response) {
		response.render("chat.html");
	});

	//blog/1
	//blog/2
	app.get("/blog/:articuloId([0-9]+)", function(request, response) {

		var articuloId = request.params.articuloId;

		console.log("buscando articulo con id:" + articuloId);
		modelos.Articulo.find({
			where : {
				id : articuloId
			},
			include : [{
				model : modelos.Comentario,
				as : "comentarios"
			}, {
				//Por medio del mapeo N-N accedo a las categorias asociadas a un artículo en particular
				model : modelos.Categoria,
				as : "categorias"
			}]
		}).success(function(articulo) {
			//AQUI PONEMOS EL CÓDIGO A EJECUTAR CUANDO YA SE HIZO LA CONSULTA A LA BD
			response.render("articulo.html", {
				articulo : articulo
			});

		});
	});

	app.get("/usuario/:usuarioId([0-9]+)", function(request, response) {

		var usuarioId = request.params.usuarioId;

		console.log("buscando usuario con id:" + usuarioId);
		modelos.Usuario.find({
			//Este bloque trae la asociación de artículos por usuario
			where : {
				id : usuarioId
			},
			include : [{
				model : modelos.Articulo,
				as : "articulos"
			}]
		}).success(function(usuario) {
			//AQUI PONEMOS EL CÓDIGO A EJECUTAR CUANDO YA SE HIZO LA CONSULTA A LA BD
			response.render("usuario.html", {
				usuario : usuario
			});

		});
	});
};
