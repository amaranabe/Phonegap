
//VARIABLES
	var socio_logeado = "";  // guardaremos el nombre del socio que se ha loggeado
	var total_sociedad = 0;  // coste de los elementos cocina utilizados (servilletas, mesas,...)
	var total_productos = 0;  // coste de los productos consumidos
	var total_factura = 0; // coste total de la factura
	
	var turno = ""; 
	var num_comensales = 0;
	var strMesas= ""; //guardamos en un string las mesas
		
//CONEXIÓN A BASE DE DATOS

/* Funcion para mostrar una tabla. De momento sólo hay una.*/
function showTable(tableName) {
	var str = "" ;
	str="MOSTRANDO LA TABLA "+tableName+":\n";
    var db = window.openDatabase("gestionsocios", "1.0", "Gestion Soci", 200000);    
    db.transaction(function (tx) { 							
	                tx.executeSql('SELECT * FROM ' + tableName, [], function (tx, results) {						 	
						 	var len = results.rows.length;
						 	//alert ("number of results : " + len);
							for (var i=0; i<len; i++){
								var colname = results.rows.item(i).Name;
								str = str + "Row = " + i + " id_socio:" + results.rows.item(i).id_socio + " nombre_socio:" + results.rows.item(i).nombre_socio + "\n";
							}
							alert(str);
					},null);

	}, null, null);
}


/* Funciones para hacer el login*/
	function selectSuccess(tx, results) {    		
       		var len = results.rows.length;
        	//alert("demo table: " + len + " rows found.");
        	if (len==0) {
        		alert('usuario no existe');
        	}
        	else {
	        	//traza
	        	var str = "" ;
	        	for (var i=0; i<len; i++){
	            	str = str + "Row = " + i + " ID = " + results.rows.item(i).id_socio + " Nombre =  " + results.rows.item(i).nombre_socio + " Pass = " + results.rows.item(i).pass_socio + "\n";
	        	}

				var encontrado_pass=false;
	        	for (var i = 0; i < results.rows.length; i++) {
	        		if (results.rows.item(i).pass_socio== document.getElementById('txtclave').value) {
	        				//password existe --> accedemos al menú de la aplicación
	        				encontrado_pass=true;
	        				socio_logeado = results.rows.item(i).nombre_socio;
	        				alert("Bienvenido usuario " + socio_logeado);
	        		}
        		}
        		if(encontrado_pass) {
        			//self, abre un link en la misma ventana
					 window.open('#menu','_self');
        		}
        		else {alert('Password incorrecto');}      		
        	}
    }

    function errorBD(err) {
	       alert("errorCB: Error procesando SQL: "+err.code);
	}

	function successTransaction() {
		//para comprobar que la transacción ha ido bien
	}

	function login(){
		//abro la base de datos
		var db = window.openDatabase("gestionsocios", "1.0", "Gestion Soci", 200000);
	    db.transaction(logincheck, errorBD, successTransaction);
	}

	// Create and populate the database 
    function logincheck(tx) {
        nombre_socio = document.getElementById("txtsociologin").value;
        tx.executeSql('SELECT * FROM socios WHERE nombre_socio="' + nombre_socio +'"', [], selectSuccess, errorBD);
    }


//FUNCIONES PARA CALCUALR EL COSTE DE LOS CONSUMOS

/* Funciones para calcular la factura, que serán llamados cuando generemos factura*/
	function totalSociedad(){
		num_comensales = document.getElementById("comensales").value;
		//mirar que turno se ha seleccionado
		 var temp=document.getElementsByName("turnocomida");
        // Recorremos todos los valores del radio button para encontrar el valor seleccionado
        for(var i=0;i<temp.length;i++) {
            if(temp[i].checked)
                turno = temp[i].value;
        }
		
		//mirar que mesas se han reservado
		strMesas="";
		for (var i=1;i<=12;i++){
			if ( document.getElementById('mesa'+i).checked ){
					if (strMesas.length > 0) strMesas = strMesas + " - "; 
					strMesas = strMesas + i;
			}
		}

		total_sociedad=(1.50*document.getElementById("mantel").value)+(5.50*document.getElementById("aceitelitro").value)+
		(0.80*document.getElementById("aceitebotellin").value)+(1.50*document.getElementById("descorcheaceite").value)+
		(1.50*document.getElementById("patatasfritas").value)+(0.25*document.getElementById("servilleta").value)+
		(0.40*document.getElementById("gas").value)+(0.40*document.getElementById("asadorelectrico").value)+
		(0.80*document.getElementById("despensasocio").value)+(1.50*document.getElementById("despensanosocio").value);	
	}


	function totalproductos(){
		total_productos=(4.00*document.getElementById("vinocosechero").value)+(8.00*document.getElementById("vinocrianza34").value)+
		(16.00*document.getElementById("vinocrianzamagnum").value)+(11.00*document.getElementById("vinoreserva").value)+
		(4.50*document.getElementById("vinoclarete").value)+(4.50*document.getElementById("vinoclareteaguja").value)+
		(5.50*document.getElementById("vinoblancoseco").value)+(5.50*document.getElementById("vinoblancoaguja").value)+
		(9.00*document.getElementById("txakoli").value)+(2.80*document.getElementById("sidra").value)+
		(2.50*document.getElementById("descorchedevinos").value)+(9.50*document.getElementById("cava").value)+
		(30.00*document.getElementById("champagne").value)+(3.00*document.getElementById("descorchecavas").value)+
		(1.90*document.getElementById("coñac").value)+(1.90*document.getElementById("ginebra").value)+
		(1.50*document.getElementById("anis").value)+(2.00*document.getElementById("cointreau").value)+
		(1.90*document.getElementById("whisky").value)+(2.60*document.getElementById("whiskydemalta").value)+
		(1.90*document.getElementById("baileys").value)+(1.90*document.getElementById("ron").value)+
		(2.60*document.getElementById("ronreserva").value)+(1.90*document.getElementById("vodka").value)+
		(1.70*document.getElementById("licormanzanamelocoton").value)+(1.70*document.getElementById("licordehierbas").value)+
		(2.70*document.getElementById("armagnac").value)+(0.80*document.getElementById("aguamineral").value)+
		(1.00*document.getElementById("tonica").value)+(1.00*document.getElementById("kas").value)+
		(1.00*document.getElementById("cocacola").value)+(1.40*document.getElementById("cerveza").value)+
		(0.75*document.getElementById("infusiones").value)+(0.75*document.getElementById("cafesolocortadoconleche").value)+
		(0.75*document.getElementById("descafeinado").value)+(1.00*document.getElementById("puros").value);
		//alert("total: " + total_produtos);
	}

	function totalfactura(){
		totalSociedad();
		totalproductos();

		document.getElementById("txtsocio").innerHTML = socio_logeado;
		document.getElementById("txtturno").innerHTML = turno;
		document.getElementById("txtmesa").innerHTML = strMesas;
		document.getElementById("txtcomensales").innerHTML = num_comensales;
		//utilizo método toFixed() para mostrar float con 2 decimales. Cuidado, devuelve un string (sólo usar para mostrar).
		document.getElementById("txtsociedad").innerHTML = total_sociedad.toFixed(2);		
		document.getElementById("txttotalconsumido").innerHTML = total_productos.toFixed(2);
		document.getElementById("txttotalfactura").innerHTML = (total_sociedad + total_productos).toFixed(2);	
		var total_por_persona; 
		if (num_comensales == 0) { total_por_persona=0; }
		else {
			total_por_persona= (total_sociedad + total_productos) / num_comensales;
		}
			
		document.getElementById("txttotalporpersona").innerHTML = total_por_persona.toFixed(2);
	}

	function cerrarSesion(){

		document.getElementById("comensales").value="";
		 var temp=document.getElementsByName("turnocomida");
        // Recorremos todos los valores del radio button para encontrar el valor seleccionado
        for(var i=0;i<temp.length;i++) {
            temp[i].checked =false;
           }

		for (var i=1;i<=12;i++){
			document.getElementById('mesa'+i).checked =false;
		}
		document.getElementById("mantel").value="";
		document.getElementById("aceitelitro").value="";
		document.getElementById("aceitebotellin").value="";
		document.getElementById("descorcheaceite").value="";
		document.getElementById("patatasfritas").value="";
		document.getElementById("servilleta").value="";
		document.getElementById("gas").value="";
		document.getElementById("asadorelectrico").value="";
		document.getElementById("despensasocio").value="";
		document.getElementById("despensanosocio").value="";	

	    document.getElementById("vinocosechero").value="";
	    document.getElementById("vinocrianza34").value="";
		document.getElementById("vinocrianzamagnum").value="";
		document.getElementById("vinoreserva").value="";
		document.getElementById("vinoclarete").value="";
		document.getElementById("vinoclareteaguja").value="";
		document.getElementById("vinoblancoseco").value="";
		document.getElementById("vinoblancoaguja").value="";
		document.getElementById("txakoli").value="";
		document.getElementById("sidra").value="";
		document.getElementById("descorchedevinos").value="";
		document.getElementById("cava").value="";
		document.getElementById("champagne").value="";
		document.getElementById("descorchecavas").value="";
		document.getElementById("coñac").value="";
		document.getElementById("ginebra").value="";
		document.getElementById("anis").value="";
		document.getElementById("cointreau").value="";
		document.getElementById("whisky").value="";
		document.getElementById("whiskydemalta").value="";
		document.getElementById("baileys").value="";
		document.getElementById("ron").value="";
		document.getElementById("ronreserva").value="";
		document.getElementById("vodka").value="";
		document.getElementById("licormanzanamelocoton").value="";
		document.getElementById("licordehierbas").value="";
		document.getElementById("armagnac").value="";
		document.getElementById("aguamineral").value="";
		document.getElementById("tonica").value="";
		document.getElementById("kas").value="";
		document.getElementById("cocacola").value="";
		document.getElementById("cerveza").value="";
		document.getElementById("infusiones").value="";
		document.getElementById("cafesolocortadoconleche").value="";
		document.getElementById("descafeinado").value="";
		document.getElementById("puros").value="";

	}