//IMPORTAMOS LA LIBRERIA DE EXPRESS
//MODELO VISTA CONTROLADOR


var express = require("express");
var nunjucks = require("nunjucks");
//ESTO NO ERA NECESARIO EN LA VERSION 3 DE EXPRESS
//ES OBLIGATORIO EN LA 4
var serveIndex = require("serve-index");
var serveStatic = require("serve-static");

var socketio = require("socket.io");
var sanitizer = require("sanitizer");

// ------------------------- LIBRERIA CORE DE NODE -----------------
var http = require("http");


/*---------- IMPORTAMOS NUESTROS MODULOS -------------------*/
var rutas = require("./rutas/rutas.js");
//SOLUCION EJERCICIO modulos
var modelos = require("./modelos/modelos.js");

console.log("constante 1 valor:" + rutas.CONSTANTE1);

//ESTO HABILITA EL PODER RECIBIR DATOS POR HTTP-POST
//EXPRESS 3 TAMBIEN TIENE EL BODY PARSER
//EN EXPRESS 3 NUNCA NUNCA USEN bodyParser USEN express.urlencoded()
// es por que EN LA 3 SE INCLUYE EL MANEJO DE MULTI-PART
var bodyParser = require("body-parser");

//CREAMOS AL SERVIDOR WEB
var app = express();
// ESTO LO HACEMOS PARA PODER USAR WEBSOCKETS
var servidor = http.createServer(app);

//CONFIGURARMOS nunjucks para trabajar con express
// __dirname == LA RUTA ACTUAL EN LA QUE SE ENCUENTRA ESTE ARCHIVO
nunjucks.configure(__dirname + "/vistas", {
	express : app
});

//MUESTRA LOS RECURSOS DE LA CARPETA /estaticos
//PRIMER ARGUMENTO = NOMBRE LOGICO (ALIAS)
//SEGUNDO ARGUMENTO ES LA RUTA REAL DE LA CARPETA

//EL app.use DA DE ALTA UN MIDDLEWARE EN EXPRESS
app.use("/estaticos", serveStatic(__dirname + "/estaticos"));
app.use("/estaticos", serveIndex(__dirname + "/estaticos"));

app.use(bodyParser());

rutas.configurar(app);
//SOLUCION EJERCICIO modulos
modelos.configurar();

//HABILITA WEBSOCKETS EN EL SERVIDOR CON SOCKET.IO
//io = me permite escuchar y responder a mis clientes usando 
//websockets
var io = socketio.listen(servidor);

servidor.listen(8081);

//CUANDO ALGUIEN PONGA http://localhost:8081/

console.log("servidor web listo");

var contadorUsuarios = 0;

//TAREA:

//-------------- INICIA CHAT---------------
// connection me permite escuchar cuando un cliente se conecta
// cuando un cliente se conecta, socket.io nos pasa un objeto
//en la funcion que representa al cliente
io.sockets.on("connection", function(socket){
	
	contadorUsuarios++;	
	console.log("SE CONECTO UN CLIENTE");
	
	//avisamos a todos los clientes que actualice el contador
	io.sockets.emit("actualiza-contador",{
		contador:contadorUsuarios
	});
	
	//disconnect se produce cuando el cliente se desconecta
	// on = ESCUCHAR UN EVENTO
	socket.on("disconnect",function(){
		
		console.log("se desconecto un cliente!!");
		contadorUsuarios--;
		
		//avisamos a todos los demas usarios que actualicen el contador		
		io.sockets.emit("actualiza-contador",{
			contador:contadorUsuarios
		});
		
	});
	
	socket.on("mensaje-al-servidor",function(datosCliente){
		
		//LIMPIAMOS LOS DATOS DEL CLIENTE DE UN POSIBLE ATAQUE
		//DE XSS
		var mensaje = sanitizer.escape(datosCliente.mensaje);
		var usuario = sanitizer.escape(datosCliente.usuario);
		
		//console.log("usuario:" + datosCliente.usuario + ", mensaje:" + datosCliente.mensaje);
		
		//RENVIAMOS DATOS A TODOS LOS CLIENTES
		io.sockets.emit("mensaje-al-cliente",{
			mensaje:mensaje,
			usuario:usuario
		});		
		
	});
	
});



