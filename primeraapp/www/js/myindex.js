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
		alert(path_actual);
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
		insertarTicketEnBD(cantidad, path) ;
				
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


//// FUNCIONES PARA COMPROBAR EL CORRECTO FUNCIONAMIENTO DE LA BASE DE DATOS


/*function MostrarBD(show_callback)
{

		var db = window.openDatabase("prueba", "1.0", "PhoneGap Demo", 2*1024*1024);
		db.transaction(showDB, errorBD, function(tx, results)
			{


			});


}
function showDB(tx) {

    tx.executeSql('SELECT * FROM demo', [], selectSuccess, errorBD);
}
*/

var tabla_a_borrar="";
	function borrarTablaDeBD( bd, tabla)
	{
		tabla_a_borrar=tabla;
		 var db = window.openDatabase(bd, "1.0", "PhoneGap Demo", 2*1024*1024);
   	    db.transaction(deleteBD, errorTD, successTD);
	}

	function successTD() {
	   	alert("successTD: éxito borrando tabla" + tabla_a_borrar);
	   	tabla_a_borrar="";
	}

	function errorTD() {
	   	alert("errorTD: No se pudo borrar tabla" + tabla_a_borrar);
	   	tabla_a_borrar="";
	}

	function deleteBD(tx) {
        tx.executeSql('DROP TABLE IF EXISTS '+tabla_a_borrar);
        tx.executeSql('CREATE TABLE IF NOT EXISTS demo (id INTEGER PRIMARY KEY AUTOINCREMENT, amount, path)');
        id=0;

	}
	    
	function selectSuccess(tx, results) {
       		alert("showing");
       		 var len = results.rows.length;
        	//alert("demo table: " + len + " rows found.");
        	var str = "contenido tabla demo en bd prueba:\n---------------------------\n" ;
        	for (var i=0; i<len; i++){
            	str = str + "Row = " + i + " ID = " + results.rows.item(i).id + " amount =  " + results.rows.item(i).amount + " path = " + results.rows.item(i).path + "\n";
        	}
        	alert(str);
    	}

	// Transaction success callback
	//

	var amount_to_insert;
	var path_to_insert="";
	var id=0;

    function insertarTicketEnBD(cantidad, path) {
		amount_to_insert = cantidad_total;
		var db = window.openDatabase("prueba", "1.0", "PhoneGap Demo", 2*1024*1024);
		db.transaction(insertNew, errorBD, successIN);
	}

	function insertNew(tx) {
    
    	var query = 'INSERT INTO demo (id, amount, path) VALUES (DEFAULT, "'+amount_to_insert + '","'+path_to_insert+'")';
    	alert("lanzando la query: " + query);
        // tx.executeSql('INSERT INTO demo (id, amount, path) VALUES ('+id+', "'+amount_to_insert + '","'+path_to_insert+'")');
	     tx.executeSql(query); 
        id ++;

        tx.executeSql('SELECT * FROM demo', [], selectSuccess, errorBD);
    }
  	function errorBD(err) {
	       alert("errorCB: Error procesando SQL: "+err.code);
	}

	function successIN() {
	   	alert("successIN: éxito insertando nueva tupla");
	}

	//-- Nueva cuenta, ponemos 0 las variables para volver a empezar --//
	function nuevosGastos () {

		
	    alert("inicializando");
		cantidad_total = "0";
		
		document.getElementById("Total_Amount_label").innerHTML = "Total acumulado: " + cantidad_total  + " &#8364;";
		actualizarPaginaPpal();
		vaciarListaTickets();
		cantidad_actual = 0;
		document.getElementById("Amount_label").innerHTML ="Total ahora: " + cantidad_actual  + " &#8364;";
	}