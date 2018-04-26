var listaElementos=new Array();
var permArr = [];
var usedChars = [];
var listaPermutaciones;

$(document).ready(function () {
	var linkInterno = $("a[rel=desplazo]");
	linkInterno.on("click",function(t){t.preventDefault();var e=$(this).attr("href");""!=e&&($("html, body").animate({scrollTop:$(e).offset().top-80},"slow"))});
	$("#elemento").keypress(function() {
		$("#validar-elemento p").text("");
	});

	$("#elemento").keyup(function() {
		var patron = /^[a-zA-Z0-9]*$/;
		
		if (!($("#elemento").val().search(patron))) {
			if ( $("#elemento").val().length >= 2 ) {
				$("#validar-elemento p").text("Sólo es un caracter a la vez. Presiona el + para agregar.");
				$("#elemento").val(
				    function(index, value){
				        return value.substr(0, value.length - 1);
				})
			}
		} else {
			$("#validar-elemento p").text("Caracter no válido, sólo A-Z a-z 0-9.");
			$("#elemento").val(
			    function(index, value){
			        return value.substr(0, value.length - 1);
			})
		}
	});

	$("#agregar-caracter").click(function () {
		if ( $("#elemento").val().length == 0 )
			$("#validar-elemento p").text("Valor requerido para agregar.");
		else {
			if(listaElementos == 0)
				$("#tablaElementos tbody").html("");
			listaElementos.push($("#elemento").val());
			var nuevaFila="<tr>";
			nuevaFila+="<td>"+$("#elemento").val()+"</td>";
			nuevaFila+="<td><button type=\"button\" class=\"eliminarCaracter btn btn-danger\"><i class=\"fa fa-trash\"></i></button></td>";
            nuevaFila+="</tr>";
			$("#tablaElementos").append(nuevaFila);
			$("#elemento").val("");
		}
		return false;
	});

	$("#buscar-combinaciones").click(function () {
		if (0 == listaElementos.length){
			alert("No hay elementos a combinar");
		} else {
			generarCombinaciones(listaElementos);
		}
		return false;
	});

	$("#tablaElementos").on('click', '.eliminarCaracter', function () {
		var elemento = $(this).parent("td").siblings('td').text();
		var i = listaElementos.indexOf(elemento);
		if ( i !== -1 ) {
			listaElementos.splice( i, 1 );
		}
		var elementoBorrar = $(this).closest('tr');
		elementoBorrar.remove();
		if (listaElementos.length == 0){
			var nuevaFila="<tr><td colspan=\"2\" style=\"color: red\">Sin elementos</td></tr>";
			$("#tablaElementos").append(nuevaFila);
		}
	});
});

function nuevoCalculo() {
	$(".container-resultado").css("display","none");
	listaElementos.length = 0;
	permArr = [];
	usedChars = [];
	listaPermutaciones.length = 0;
	$('html, body').animate({scrollTop : $("#calculadora").offset().top}, 'slow');
	$("#tablaCaracteresR tbody").html("");
	$("#tablaCombinaciones tbody").html("");
	if (listaElementos.length == 0){
		$("#tablaElementos tbody").html("");
		var nuevaFila="<tr><td colspan=\"2\" style=\"color: red\">Sin elementos</td></tr>";
		$("#tablaElementos").append(nuevaFila);
	}
	$("#numeroCombinaciones p").html("");
}

function generarCombinaciones() {
	permArr = [];
	usedChars = [];
	$("#tablaCaracteresR tbody").html("");
	$("#tablaCombinaciones tbody").html("");
	$(".container-resultado").css("display","block");
	$('html, body').animate({scrollTop : $("#resultado-contenedor").offset().top}, 'slow');
	var numPermutaciones = obtenerPermutaciones(listaElementos.length);
	$("#numeroCombinaciones p").html("No. de permutaciones posibles: <b>"+numPermutaciones+"</b>.<br>");
	listaElementos.forEach( function(valor, indice, array) {
	    var nuevaFila="<tr><td>"+valor+"</td></tr>";
		$("#tablaCaracteresR").append(nuevaFila);
	});
	listaPermutaciones = permute(listaElementos);
	listaPermutaciones.forEach( function(valor, indice, array) {
		var combinacion="";
		valor.forEach( function(valorA, indiceA, arrayA) {
			if (indiceA == (valor.length-1) )
				combinacion+=valorA;
			else
				combinacion+=valorA+" , ";
		});
		var nuevaFila="<tr><td>"+(indice+1)+"</td><td>"+combinacion+"</td></tr>";
		$("#tablaCombinaciones").append(nuevaFila);
	});

	var documento = "";
	documento +="IDENTIFICADOR, PERMUTACION \n";
	listaPermutaciones.forEach( function(valor, indice, array) {
		var combinacion="";
		valor.forEach( function(valorA, indiceA, arrayA) {
			if (indiceA == (valor.length-1) )
				combinacion+=valorA;
			else
				combinacion+=valorA+" ; ";
		});
		documento +=(indice+1)+","+combinacion+"\n";
	});

	$("#exportarCombinaciones").attr("download", "CarlosVladimirQuinteroCarrasco-Combinaciones.csv");
	$("#exportarCombinaciones").attr("href", "data:application/octet-stream," + encodeURIComponent(documento) );
}

function obtenerPermutaciones (tam) {
	if (tam == 0)
		return 1;
	else
		return tam * obtenerPermutaciones (tam - 1);
}

function permute(input) {
  var i, ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};

