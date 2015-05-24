
//VARIABLES
	var nombre_socio = "";
	var total_sociedad = 0;
	var total_produtos = 0;
	var total_factura = 0;
	var turno = "";
	var num_comensales = 0;
	var strMesas= "";

	//var mesas_cogidas[12]= {false,false,,false,false,false,false,false,false,false,false,false,false};
		
//CONEXIÓN A BASE DE DATOS

/* Funcion para saber un id disponible de una tabla*/

function nextIdInTableAvailable(id_name, tableName)
{


    var db = window.openDatabase("gestionsocios", "1.0", "Gestion Soci", 200000);

    
    db.transaction(function (tx)
    				{

		              /*  tx.executeSql('SELECT '+ id_name +' FROM ' + tableName + ' ORDER BY '+id_name+' ASC', [], 
		                	function (tx, results) {
        			        			 	var str = "" ;
										 	var len = results.rows.length;
										 	alert ("number of results : " + len);
										 	var max_id=0;
											for (var i=0; i<len; i++){
												str = str + "Row = " + i + " ID = " + eval('results.rows.item(i).'+id_name) + "\n";
												if (max_id <eval('results.rows.item(i).'+id_name)
													max_id = eval('results.rows.item(i).'+id_name);
											}
											alert(str);

											console.log("hay resultados en la vuelta " + max_id);

										},null);*/

        			}, null, null);

}

/* Funcion para mostrar una tabla*/
function showTable(tableName)
{

	alert("MOSTRANDO LA TABLA "+tableName);

    var db = window.openDatabase("gestionsocios", "1.0", "Gestion Soci", 200000);

 
    
    db.transaction(function (tx)
    				{
    							

		                tx.executeSql('SELECT * FROM ' + tableName, [], function (tx, results) {
		                									 	var str = "" ;
        			    									 	var len = results.rows.length;
        			        								 	alert ("number of results : " + len);
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
	        	alert(str);

				var encontrado_pass=false;
	        	for (var i = 0; i < results.rows.length; i++) {
	        		if (results.rows.item(i).pass_socio== document.getElementById('txtclave').value) {
	        				//password existe --> accedemos al menú de la aplicación
	        				encontrado_pass=true;
	        		}
        		}

        		if(encontrado_pass) window.open('#menu','_self');
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
		var db = window.openDatabase("gestionsocios", "1.0", "Gestion Soci", 3);
	    db.transaction(logincheck, errorBD, successTransaction);
	}

	// Create and populate the database 
    function logincheck(tx) {
       
        nombre_socio = document.getElementById("txtsociologin").value;
        tx.executeSql('SELECT * FROM socios WHERE nombre_socio="' + nombre_socio +'"', [], selectSuccess, errorBD);
    }



/* Funciones para calcular la factura*/
	function totalSociedad(){
		
		num_comensales = document.getElementById("comensales").value;
		
		//mirar que turno se ha seleccionado
		 var temp=document.getElementsByName("turnocomida");
        // Recorremos todos los valores del radio button para encontrar el
        // seleccionado
        for(var i=0;i<temp.length;i++)
        {
            if(temp[i].checked)
                turno = temp[i].value;
        }
		
		//mirar que mesas se han reservado

		if (document.getElementById("mesa1").checked){
			strMesas = strMesas + " 1 -"
		}
		if (document.getElementById("mesa2").checked){
			strMesas = strMesas + " 2 -"
		}
		if (document.getElementById("mesa3").checked){
			strMesas = strMesas + " 3 -"
		}
		if (document.getElementById("mesa4").checked){
			strMesas = strMesas + "4 -"
		}
		if (document.getElementById("mesa5").checked){
			strMesas = strMesas + " 5 -"
		}
		if (document.getElementById("mesa6").checked){
			strMesas = strMesas + "6 -"
		}
		if (document.getElementById("mesa7").checked){
			strMesas = strMesas + " 7 -"
		}
		if (document.getElementById("mesa8").checked){
			strMesas = strMesas + " 8 -"
		}
		if (document.getElementById("mesa9").checked){
			strMesas = strMesas + " 9 -"
		}
		if (document.getElementById("mesa10").checked){
			strMesas = strMesas + " 10 -"
		}
		if (document.getElementById("mesa11").checked){
			strMesas = strMesas + " 11 -"
		}
		if (document.getElementById("mesa12").checked){
			strMesas = strMesas + " 12"
		}


		total_sociedad=(1.50*document.getElementById("mantel").value)+(5.50*document.getElementById("aceitelitro").value)+
		(0.80*document.getElementById("aceitebotellin").value)+(1.50*document.getElementById("descorcheaceite").value)+
		(1.50*document.getElementById("patatasfritas").value)+(0.25*document.getElementById("servilleta").value)+
		(0.40*document.getElementById("gas").value)+(0.40*document.getElementById("asadorelectrico").value)+
		(0.80*document.getElementById("despensasocio").value)+(1.50*document.getElementById("despensanosocio").value);

		
	}

	function totalproductos(){
		total_produtos=(4.00*document.getElementById("vinocosechero").value)+(8.00*document.getElementById("vinocrianza34").value)+
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

	}

	function totalfactura(){
		document.getElementById("txtsocio").innerHTML = nombre_socio;
		document.getElementById("txtturno").innerHTML = turno;
		document.getElementById("txtmesa").innerHTML = strMesas;
		document.getElementById("txtcomensales").innerHTML = num_comensales;
		document.getElementById("txtsociedad").innerHTML = total_sociedad;		
		document.getElementById("txttotalconsumido").innerHTML = total_produtos;
		document.getElementById("txttotalfactura").innerHTML = total_sociedad + total_produtos;
		document.getElementById("txttotalporpersona").innerHTML = (total_sociedad + total_produtos) / num_comensales;
	}