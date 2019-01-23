var diferente = window.location.pathname;
console.log(diferente);

if (diferente == "/senate-attendance.html") {
	diferente = "senate";
}
if (diferente == "/house_attendance.html") {
	diferente = "house";
}


var url = "https://api.propublica.org/congress/v1/113/" + diferente + "/members.json";
var allMembers;
var allMembersRepeat; //double the array "allmembers" to order it and that the first one is not modified
var allMembersRepeat2;
var rep = [];
var dem = [];
var ind = [];
var total = [];

fetch(url, {

	headers: {
		"X-API-Key": "QjAnrhMfW4qsQRXckkyVrwr44BwkoPvJqErI7Zzz"
	}
}).then(function (data) {
	return data.json();
}).then(function (myData) {
	console.log(myData);
	allMembers = data.results[0].members;
	allMembersRepeat = Array.from(allMembers);
	allMembersRepeat2 = Array.from(allMembers);
	duplicated1(allMembers);
	var menor = pusha(allMembersRepeat);
	duplicated2(allMembers);
	var mayor = pusha(allMembersRepeat2);
	numberMembers(allMembersRepeat);
	var statistics = {
		"number_of_Democrats": dem.length,
		"number_of_Republicans": rep.length,
		"number_of_Independents": ind.length,
		"number_Total": total.length,
		"votes_with_party_pct_rep": suma(rep),
		"votes_with_party_pct_dem": suma(dem),
		"votes_with_party_pct_ind": suma(ind),
		"votes_pct_total": (suma(rep) + suma(dem) + suma(ind)) / 3,
	}
	tableTop(statistics);
	bottomTabla(menor);
	bottomTabla2(mayor);

})
//FTN genera Table top
function tableTop(statistics) {
	function numberTable() {
		var td1 = document.getElementById("numRep");
		td1.innerHTML = statistics.number_of_Republicans;
		var td2 = document.getElementById("numDem");
		td2.innerHTML = statistics.number_of_Democrats;
		var td3 = document.getElementById("numInd");
		td3.innerHTML = statistics.number_of_Independents;
		var td123 = document.getElementById("numTotal");
		td123.innerHTML = statistics.number_Total;
	}
	numberTable();

	function votesParty() {
		var td4 = document.getElementById("votesRep");
		td4.innerHTML = statistics.votes_with_party_pct_rep.toFixed(2) + "%"; //tofixed reduce decimals
		var td5 = document.getElementById("votesDem");
		td5.innerHTML = statistics.votes_with_party_pct_dem.toFixed(2) + "%";
		var td6 = document.getElementById("votesInd");
		td6.innerHTML = statistics.votes_with_party_pct_ind.toFixed(2) + "%";
		var td456 = document.getElementById("votesTotal");
		td456.innerHTML = statistics.votes_pct_total.toFixed(2) + "%";
	}
	votesParty();
}
//FTN ordenar array duplicada por missed votes pct
function duplicated1() {
	allMembersRepeat.sort(function (a, b) { //el sort necesita saber cual es mas grande y los compara con este if
		if (a.missed_votes_pct > b.missed_votes_pct) {
			return 1;
		}
		if (a.missed_votes_pct < b.missed_votes_pct) {
			return -1;
		}
		// a must be equal to b
		return 0;
	});
}
//FTN ordenar al reves la array ordenada
function duplicated2() {
	allMembersRepeat2.sort(function (a, b) {
		if (a.missed_votes_pct > b.missed_votes_pct) {
			return -1; //cambiando el return por 
		}
		if (a.missed_votes_pct < b.missed_votes_pct) {
			return 1;
		}
		// a must be equal to b
		return 0;
	});

}
//FTN el 10% y meterlos en una array//comparar miembros que tiene el mismo valor que el ultimo de la nueva array
function pusha(news) {
	var calculoDiez = Math.round(allMembersRepeat.length * 10 / 100); // math.round nos sirve para redondear los numeros
	var resultPct = []; //meter el 10%

	for (var j = 0; j < news.length; j++) { //calcula el 10%
		if (resultPct.length < calculoDiez) {
			resultPct.push(news[j]);
		}
	}
	for (var k = resultPct.length; k < news.length; k++) {
		if (resultPct[resultPct.length - 1].missed_votes_pct == news[k].missed_votes_pct) { // añadir miembros value igual
			resultPct.push(news[k]);
		}
	}
	return resultPct;
}
//FTN tabla top calcular los miembros de cada partido y total
function numberMembers(recuento) {
	for (var i = 0; i < recuento.length; i++) {
		if (recuento[i].party == "R") {
			rep.push(recuento[i]);
		}
		if (recuento[i].party == "D") {
			dem.push(recuento[i]);
		}
		if (recuento[i].party == "I") {
			ind.push(recuento[i]);
		}
		if (recuento.length) {
			total.push(recuento[i])
		}
	}


}
//FTN tabla top para calcular el % votes with party pct
function suma(sumarVotes) {

	var votesTotal = 0;
	if (sumarVotes == 0) { // cambiar el NaN por 0
		return 0;
	} else {

		for (var i = 0; i < sumarVotes.length; i++) {
			votesTotal = votesTotal + sumarVotes[i].votes_with_party_pct;
		}
	}
	return votesTotal / sumarVotes.length;

}
//FTN genera la tabla bottom
function bottomTabla(TheMembers) {

	var table = document.getElementById("less");

	for (var i = 0; i < TheMembers.length; i++) {
		var tr = document.createElement("tr"); //creamos las tr /td / de la tabla
		var td = document.createElement("td"); //
		tr.setAttribute("class", TheMembers[i].party); //ponemos clases añadiendo el atributo a las tr
		if (TheMembers[i].middle_name == null) {
			td.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].last_name;
		} else {
			td.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].middle_name + " " + TheMembers[i].last_name;
		} //al ser null el segundo nombre en algunos casos creamos un if y a los null le quitamos el middlename y si no da true(sin null)lo imprime 

		tr.appendChild(td);
		var tdmissed = document.createElement("td"); //creamos los td y los asociamos  hijo/padre
		tdmissed.innerHTML = TheMembers[i].missed_votes; //añadimos a las columnas creadas los datos 
		tr.appendChild(tdmissed);

		var tdmissedvote = document.createElement("td"); //loop para encontrar cada parametro y posicionarle en una tabla
		tdmissedvote.innerHTML = TheMembers[i].missed_votes_pct + "%";
		tr.appendChild(tdmissedvote);
		table.appendChild(tr);

	}

}

function bottomTabla2(TheMembers) {

	var table = document.getElementById("more");

	for (var i = 0; i < TheMembers.length; i++) {



		var tr = document.createElement("tr"); //creamos las tr /td / de la tabla
		var td = document.createElement("td"); //


		tr.setAttribute("class", TheMembers[i].party); //ponemos clases añadiendo el atributo a las tr
		if (TheMembers[i].middle_name == null) {
			td.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].last_name;
		} else {
			td.innerHTML = TheMembers[i].first_name + " " + TheMembers[i].middle_name + " " + TheMembers[i].last_name;
		} //al ser null el segundo nombre en algunos casos creamos un if y a los null le quitamos el middlename y si no da true(sin null)lo imprime 

		tr.appendChild(td);
		var tdmissed = document.createElement("td"); //creamos los td y los asociamos  hijo/padre
		tdmissed.innerHTML = TheMembers[i].missed_votes; //añadimos a las columnas creadas los datos 
		tr.appendChild(tdmissed);

		var tdmissedvote = document.createElement("td"); //loop para encontrar cada parametro y posicionarle en una tabla
		tdmissedvote.innerHTML = TheMembers[i].missed_votes_pct + "%";
		tr.appendChild(tdmissedvote);
		table.appendChild(tr);

	}

}