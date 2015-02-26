	var cantidad_total = "0";
	var cantidad_actual = "0";
	var path_actual = ""; // para guardar la dirección de la foto en la tarjeta SD
	var lista_tickets=[];// array de tickets, donde un ticket será una cantidad y un string de la ruta de una foto
	
	
//PARAR CAPTURAR FOTO
	function capturephoto () {
			sessionStorage.removeItem('imagepath');
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50,
			destinationType: Camera.DestinationType.FILE_URI});            
	}
	function onPhotoDataSuccess(imageURI) { 
			// Uncomment to view the base64 encoded image data
			// console.log(imageData);

			// Get image handle
		   // var imgProfile = document.getElementById('imgProfile');

//						  	alert ("onPhotoDataSuccess");
			// Show the captured photo
			// The inline CSS rules are used to resize the image
			//
		  //  imgProfile.src = imageURI;

			if(sessionStorage.isprofileimage==1){
				getLocation();
			}
//					        alert("URI" + imageURI)
			movePic(imageURI);
	}
	
	// Called if something bad happens.
	
	function onFail(message) {
		alert('Failed because: ' + message);
	}
	//mover la imagen temporal obtenida, a la tarjeta SD
	function movePic(file){ 
		window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
	} 
	//Callback function when the file system uri has been resolved
	function resolveOnSuccess(entry)
	{ 
		var d = new Date();
		var n = d.getTime();
		//new file name
		var newFileName = n + ".jpg";
		var myFolderApp = "MyAppFolder";

		window.requestFileSystem(  LocalFileSystem.PERSISTENT, 0, function(fileSys) { 
						 //The folder is created if doesn't exist
						 fileSys.root.getDirectory( myFolderApp,
						 {create:true, exclusive: false},
						 function(directory) {
							 entry.moveTo(directory, newFileName, successMove, resOnError);
						 },
						 resOnError);
				},
		 resOnError);
	}
	//Callback function when the file has been moved successfully - inserting the complete path
	function successMove(entry) {
		//Store imagepath in session for future use
		// like to store it in database
		// copiar la imagen a la sd

		sessionStorage.setItem('imagepath', entry.fullPath);
	   // alert (entry.fullPath);
		path_actual=entry.fullPath;
	}

	function resOnError(error) {
		alert(error.code);
	}
	
//CALCULADORA Y VARIOS

	
	function seleccionar(num) {
	
		if (num == '.')
		{
		// buscar un punto en el string de la cantidad actual
			var n = cantidad_actual.indexOf('.'); 
			
			// si no hay ningun punto (n==-1) entonces puedo poner '.' de decimales		
			if (n==-1)
			{	
				cantidad_actual = cantidad_actual+".";					
			}
		
		}
		else if (num == '-')
		{
		
					if (cantidad_actual.charAt(0) == "-")
						cantidad_actual = cantidad_actual.substr(1, cantidad_actual.length -1) ;
					else 
						cantidad_actual = "-" + cantidad_actual;
		}
		else
		{				
			if (cantidad_actual != "0" )
			{
				
				cantidad_actual = cantidad_actual + num;
			}
			else
			{
			
				cantidad_actual = num;
			}
		}
		var texto_aux = "Total ahora: " + cantidad_actual +  " &#8364;";
						
		document.getElementById("Amount_label").innerHTML = texto_aux;
	}
	
	function reset() 
	{
		cantidad_actual="0";
		document.getElementById("Amount_label").innerHTML = "Total ahora: " + cantidad_actual +  " &#8364;";
	}
	
	function suprimir() {
		if (cantidad_actual.length==1) {
			cantidad_actual='0';
		}
		else {
			//metodo substr devuelve un substring del string, y le pasamos posición y longitud.
			cantidad_actual=cantidad_actual.substr(0, cantidad_actual.length -1);
		}
		document.getElementById("Amount_label").innerHTML = "Total ahora: " + cantidad_actual +  " &#8364;";
	}
	
	function add() 
	{
		// vamos a introducir una nueva cantidad cuando pulsemos al botón añadir		
		var aux ;
		
		cantidad_total =  parseFloat(cantidad_actual) + parseFloat(cantidad_total) ;			
		document.getElementById("Total_Amount_label").innerHTML = "Total acumulado: " + cantidad_total  + " &#8364;";
		actualizar_pagina_ppal();
		registrar_ticket(cantidad_actual, path_actual);
		
		cantidad_actual = 0;
		document.getElementById("Amount_label").innerHTML ="Total ahora: " + cantidad_actual  + " &#8364;";
	}

	
	function actualizar_pagina_ppal()
	{
		document.getElementById("Mostrar_Cantidad").innerHTML =
		"Gastos: " + cantidad_total + " &#8364;";
	}

	function registrar_ticket(cantidad, path)
		{
		var ticket = [];
		ticket ["cantidad"] = cantidad;
		ticket ["path"] = path;

		//alert( ticket["cantidad"] );
		lista_tickets.push(ticket);

		document.getElementById("Numero_tickets").innerHTML ="Tickets: " + lista_tickets.length;
	}
	
	//Método para vaciar el array de tickets
	function vaciar_lista_tickets()
	{
		lista_tickets=[];
		//lista_tickets.length = 0
		document.getElementById("Numero_tickets").innerHTML ="Tickets: " + lista_tickets.length;
	}
	
	function mostrar_lista_tickets()
	{
		alert("Lista de tickets hata ahora");	
								
	}
	
	function nuevosgastos () {
		//-- Nueva cuenta, vaciamos todos los datos o ponemos a 0 las variables para volver a empezar --//
		cantidad_total = "0";
		
		document.getElementById("Total_Amount_label").innerHTML = "Total acumulado: " + cantidad_total  + " &#8364;";
		actualizar_pagina_ppal();
		vaciar_lista_tickets();
		cantidad_actual = 0;
		document.getElementById("Amount_label").innerHTML ="Total ahora: " + cantidad_actual  + " &#8364;";
	}
