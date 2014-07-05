//io existe a partir de que importamos socket.io.js

//Prueba de modificación para enviar cambio al github
var socket = io.connect("http://localhost:8081");

socket.on("actualiza-contador",function(datosServidor){
	console.log("CONTA:" + datosServidor.contador);
	$("#contador-usuarios").html(datosServidor.contador);
});

socket.on("mensaje-al-cliente",function(datosServidor){
	
	console.log("usuario:" + datosServidor.usuario + ", mensaje:" + datosServidor.mensaje);
	
	var cajaNombre = "<span>" + datosServidor.usuario + " dice:</span>";
	var caja = "<div class='mensaje'>" + cajaNombre + datosServidor.mensaje + "</div>";
	
	//append AGREGA EL HTML AL FINAL DEL CONTENIDO DE #mensajes
	$("#mensajes").append(caja);
	
});


//ESCUCHAMOS EL CLICK DEL BOTON DEL CHAT
//TAREA: CAMBIAR A DELEGACION DE EVENTOS
$("#boton").click(function(){
	
	//val obtiene el texto que haya escrito en el input
	var mensaje = $("#mensaje-usuario").val();
	var usuario = $("#nombre-usuario").val();
	
	//emit = genera un evento (primer argumento)
	//que puede escuchar el servidor
	socket.emit("mensaje-al-servidor",{
		mensaje:mensaje,
		usuario:usuario
	});
	
});



//ME PERMITE ESCUCHAR CUANDO EL USUARIO ESTA USANDO
//LAS FLECHITAS HACIA ATRAS O HACIA ADELANTE
History.Adapter.bind(window,"statechange",function(){
	console.log("el usuario cambio url!!");
	
	//ESTE METODO REGRESA EL ESTADO(OBJETO) ASOCIADO
	//A LA URL QUE SE MUESTRA EN EL NAVEGADOR
	var estado = History.getState();	
	var rutaAjax = estado.data.rutaAjax;
	
	console.log("RUTA AJAX:" + rutaAjax);
	
	$("#contenido-principal").load(rutaAjax);
	
});


//DELEGACION DE EVENTOS SUPER IMPORTANTE EN AJAX
$(document).on("click","#link-inicio",function() {
	
	History.pushState({
		rutaAjax:"/inicio-contenido",
		parametro2:"un valor"
	},"TITULO","/");
	
	//$("#contenido-principal").load("/inicio-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	//PARA EVITAR QUE OCURRA EL COMPORTAMIENTO POR DEFAULT
	//DEL ANCHOR <a>
	return false;
});

//TAREA CAMBIAR ESTE LINK A DELEGACION DE EVENTOS
$("#link-blog").click(function() {
	
	// history = es el nombre original del api del historial de html5
	// History (CON HA MAYUSCULA) es la libreria history.min.js
	//tercer argumento = URL que vamos a mostra en el navegador
	History.pushState({
		rutaAjax:"/blog-contenido",
		parametro2:"un valor"
	},"TITULO","/blog");
	
	//$("#contenido-principal").load("/blog-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	return false;
});

/*------- SOLUCION EJERCICIO AJAX:CONTACTO ----------------------*/

//TAREA CAMBIAR ESTE LINK A DELEGACION DE EVENTOS
$("#link-contacto").click(function() {
	
	
	History.pushState({
		rutaAjax:"/contacto-contenido",
		parametro2:"un valor"
	},"TITULO","/contacto");
	
	//$("#contenido-principal").load("/contacto-contenido");

	//ESTO ES MUY IMPORTANTE EN AJAX
	return false;
});

//DELEGACION DE EVENTOS
$(document).on("submit","#contactar-forma",function() {

	var datos = $("#contactar-forma").serialize();

    //AJAX OCURRE DE MANERA ASINCRONA
	$.ajax({
		url : "/contactar",
		data:datos,
		type:"POST",
		//callback que se ejecuta cuando el servidor YA NOS RESPONDIO
		success:function(datosDelServidor){
			
			alert(datosDelServidor);			
			$("#respuesta-servidor").html(datosDelServidor);			
		}
	});		
	
	//SIEMPRE PONER RETURN FALSE EN AJAX
	return false;
});

