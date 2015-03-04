//VARIABLES
	var cantidad_total = "0";
	var cantidad_actual = "0";
	var path_actual = ""; //para guardar la dirección de la foto en la tarjeta SD
	var lista_tickets=[];// array de tickets, donde un ticket será una cantidad y un string de la ruta de una foto
		
//PARAR CAPTURAR FOTO
	function capturephoto () {
			sessionStorage.removeItem('imagepath');
			navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 50,
			destinationType: Camera.DestinationType.FILE_URI});            
	}
	function onPhotoDataSuccess(imageURI) { 
			
			if(sessionStorage.isprofileimage==1){
				getLocation();
			}

			movePic(imageURI);
	}
	
	// Llamada por si falla	
	function onFail(message) {
		alert('[ERROR]  ' + message);
	}
	
	//mover la imagen temporal obtenida, a la tarjeta SD
	function movePic(file){ 
		window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError); 
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
		path_actual=entry.fullPath;
	}

	function resOnError(error) {
		alert(error.code);
	}
	
//CALCULADORA Y VARIOS
	function seleccionar(num) {
	
		if (num == '.') {
		// buscar un punto en el string de la cantidad actual
			var n = cantidad_actual.indexOf('.'); 
			
			// si no hay ningun punto, devuelve -1, entonces puedo poner '.' de decimales		
			if (n==-1) {	
				cantidad_actual = cantidad_actual+".";					
			}
		}
		else if (num == '-') {
		
					if (cantidad_actual.charAt(0) == "-")
						//metodo substr devuelve un substring del string, y le pasamos posición y longitud.
						cantidad_actual = cantidad_actual.substr(1, cantidad_actual.length -1) ;
					else 
						cantidad_actual = "-" + cantidad_actual;
		}
		else {
			if (cantidad_actual != "0" ) {				
				cantidad_actual = cantidad_actual + num;
			}
			else {			
				cantidad_actual = num;
			}
		}

		document.getElementById("Amount_label").innerHTML =  "Total ahora: " + cantidad_actual +  " &#8364;";	
	}
	
	function reset() {
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

	//rellena el array lista_ticket
	function registrarTicket(cantidad, path) {
		var ticket = [];
		ticket ["cantidad"] = cantidad;
		ticket ["path"] = path;

		lista_tickets.push(ticket);
						
		document.getElementById("Numero_tickets").innerHTML ="Tickets: " + lista_tickets.length;
	}
	
	function add() {

		// vamos a introducir una nueva cantidad cuando pulsemos al botón añadir		
		cantidad_total =  parseFloat(cantidad_actual) + parseFloat(cantidad_total) ;	
		document.getElementById("Total_Amount_label").innerHTML = "Total acumulado: " + cantidad_total  + " &#8364;";
		actualizarPaginaPpal();
		registrarTicket(cantidad_actual, path_actual);
		
		cantidad_actual = 0;
		document.getElementById("Amount_label").innerHTML ="Total ahora: " + cantidad_actual  + " &#8364;";
	}
	
	function actualizarPaginaPpal() {
		document.getElementById("Mostrar_Cantidad").innerHTML =cantidad_total + " &#8364;";
	}

	//Método para vaciar el array de tickets
	function vaciarListaTickets() {
		lista_tickets=[];
		//lista_tickets.length = 0
		document.getElementById("Numero_tickets").innerHTML ="Tickets: " + lista_tickets.length;
	}

	//-- Nueva cuenta, ponemos 0 las variables para volver a empezar --//
	function nuevosGastos () {
		cantidad_total = "0";
		
		document.getElementById("Total_Amount_label").innerHTML = "Total acumulado: " + cantidad_total  + " &#8364;";
		actualizarPaginaPpal();
		vaciarListaTickets();
		cantidad_actual = 0;
		document.getElementById("Amount_label").innerHTML ="Total ahora: " + cantidad_actual  + " &#8364;";
	}