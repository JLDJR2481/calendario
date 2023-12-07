// Constante que contiene los meses del año
const mes_valor = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
};

const dias_semana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];



// Función global que inyecta todo el calendario haciendo que el HTML parezca más limpio
function inyectarCalendario(mesActual, actualYear) {
    inyectarHeader();
    inyectarTabla(mesActual, actualYear);
    inyectarDias(mesActual, actualYear);
    aplicarEstilosPorEstacion(mesActual);

}

// Inyecta de forma automatica el header con los botones y el título
function inyectarHeader() {
    // *** Header ***
    let firstDiv = document.createElement("div"); // Div contenedor de todo el header
    firstDiv.id = "main"; // Id para poder inyectar la tabla y se mantenga dentro de este div

    let header = firstDiv.appendChild(document.createElement("header")); // Header
    header.className = "container-fluid col-12 align-items-center border-bottom";
    header.id = "header-calendario";

    // *** Botones más título ***
    // Primer botón
    let firstHeaderDiv = header.appendChild(document.createElement("div"));
    firstHeaderDiv.className = "container col-1 m-auto header-icon";

    let firstButton = firstHeaderDiv.appendChild(document.createElement("button"));
    firstButton.type = "button";
    firstButton.className = 'btn btn-outline-primary';
    firstButton.id = "mes-anterior";
    let firstIcon = firstButton.appendChild(document.createElement("i"));
    firstIcon.className = "bi bi-caret-left-fill";

    // Título
    let secondHeaderDiv = header.appendChild(document.createElement("div"));
    secondHeaderDiv.className = "container col-10 display-4";
    secondHeaderDiv.textContent = "Calendario";

    // Segundo botón
    let thirdHeaderDiv = header.appendChild(document.createElement("div"));
    thirdHeaderDiv.className = "container col-1 m-auto header-icon";

    let secondButton = thirdHeaderDiv.appendChild(document.createElement("button"));
    secondButton.type = "button";
    secondButton.className = 'btn btn-outline-primary';
    secondButton.id = "mes-siguiente";
    let secondIcon = secondButton.appendChild(document.createElement("i"));
    secondIcon.className = "bi bi-caret-right-fill";

    // Lo introduce al body
    document.body.appendChild(firstDiv);
}

// Inyecta de forma automática la tabla con el mes y año actual y los heads de la tabla que indican los dias de la semana
function inyectarTabla(mesActual, actualYear) {

    mesActualCalendario = mesActual;
    actualYearCalendario = actualYear;

    // Div
    let firstDiv = document.createElement("div");
    firstDiv.id = "main-table";
    // Año y mes
    let h2 = firstDiv.appendChild(document.createElement("h2"));
    h2.className = "text-center";
    h2.id = "calHeader";
    h2.textContent = mes_valor[mesActual] + " " + actualYear;

    // Tabla del calendario
    let table = firstDiv.appendChild(document.createElement("table"));
    table.className = "container-fluid text-center";
    table.id = "calendario";

    // Head de la tabla
    let trHeader = table.appendChild(document.createElement("tr"));

    // Se añaden los dias de la semana
    for (var index = 0; index < dias_semana.length; index++) {
        let th = trHeader.appendChild(document.createElement("th"));
        th.scope = "col";
        th.textContent = dias_semana[index];

    }

    // Se añade al body
    document.getElementById('main').appendChild(firstDiv);
}

// Inyecta los dias del mes actual en el calendario
function inyectarDias(mesActual, actualYear) {

    // Obtiene el número de dias que tiene el mes actual
    let diasEnMes = new Date(actualYear, mesActual, 0).getDate();

    // Primera semana del primer dia del mes actual;
    let primerDiaSemana = getDiaSemana(new Date(actualYear, mesActual - 1, 0));

    // Dias en blanco que hay que añadir al principio del mes
    let diasEnBlanco = dias_semana.indexOf(primerDiaSemana);

    // Obtiene la tabla del calendario
    let tablaCalendario = document.getElementById("main-table").getElementsByTagName("table")[0];

    // Fila creada actualmente
    let semanaActual;

    // iterar por cada dia del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        let diaSemana = getDiaSemana(new Date(actualYear, mesActual - 1, dia - 1));
        // Tanto si el día es 1 como si es lunes, crea una nueva fila
        if (dia === 1 || diaSemana === "Lunes") {
            // Crea una nueva fila
            semanaActual = tablaCalendario.insertRow();
            // Se insertan celdas en blanco hasta que llega al día de la semana que toca
            while (diasEnBlanco != 0) {
                semanaActual.insertCell();
                diasEnBlanco--;
            }
        }

        // Agrega celda para el día actual
        let celda = semanaActual.insertCell();
        celda.textContent = dia;

        // Si es el día actual, añade la clase "hoy"
        if (dia === new Date().getDate() && actualYear === new Date().getFullYear() && mesActual === new Date().getMonth() + 1) {
            celda.className = "hoy";
        }

        // Si no es el día actual, añade la clase "no-hoy"
        else {
            celda.className = "no-hoy";
        }

        // Añado el tipo de clase dependiendo del mes. Esto es para los estilos
        aplicarEstilosPorEstacion(mesActual);
    }

}

// Borra lo anterior y actualiza el calendario
function actualizarCalendario(mesActual, actualYear, direccion) {
    // Inicia la animación
    animarCalendario(direccion);
    setTimeout(function () {
        // Coge el calendario y lo borra mientras realiza la animación
        var mainTable = document.querySelector("#main-table");
        mainTable.remove();
        inyectarTabla(mesActual, actualYear);
        inyectarDias(mesActual, actualYear);
        // Termina la animación
        animarCalendarioEnd(direccion);

    }, 500);
}
// Devuelve el día de la semana del día que se le pasa por parámetro
function getDiaSemana(fecha) {
    let dia = fecha.getDay();
    // Devuelve dia de la semana en string
    return dias_semana[dia];
}

// Comprueba el mes cuando se interactua con los botones y los cambia. Si llega a 12 o a 1, cambia el año
function checkMes(mes, year) {
    if (mes < 1) {
        // Si es inferior a Enero (1) devuelve Diciembre (12) del año anterior
        return { mes: 12, year: year - 1 };
    } else if (mes > 12) {
        // Si es superior a Diciembre (12) devuelve Enero (1) del año siguiente
        return { mes: 1, year: year + 1 };
    } else {
        // Si no es ninguno de los casos anteriores, devuelve el mes y el año actual
        return { mes: mes, year: year };
    }
}

// Inicio de animación tras clickar alguno de los botones
function animarCalendario(direccion) {
    // Coge la tabla
    let id = "#main-table";
    // Se nombra una clase dependiendo de que botón se ha clickado
    let animationClass =
        direccion === "right"
            ? "animated-calendar-right"
            : "animated-calendar-left";
    // Se añade la clase
    $(id).addClass(animationClass);

    // Cuando termina la animación, se elimina la clase
    $(id).one("animationend", function () {
        $(id).removeClass(animationClass);
    });
}

// Final de la animación. Utilizada para dar entrada al nuevo contenido. Tiene la misma estructura que la anterior
function animarCalendarioEnd(direccion) {
    let id = "#main-table";

    let removeAnimationClass =
        direccion === "right"
            ? "animated-calendar-left-remove"
            : "animated-calendar-right-remove";
    $(id).addClass(removeAnimationClass);


    $(id).one("animationend", function () {

        $(id).removeClass(removeAnimationClass);
    });
}

// Devuelve la estación del año en función del mes para determinar estilos. Se utiliza en la función aplicarEstilosPorEstacion
function checkSeasons(mes) {
    // Si es Diciembre, Enero o Febrero devuelve invierno
    if (mes === 12 || mes === 1 || mes === 2) {
        return "winter";

    } // Si es Marzo, Abril o Mayo devuelve primavera
    else if (mes === 3 || mes === 4 || mes === 5) {
        return "spring";
    } // Si es Junio, Julio o Agosto devuelve verano 
    else if (mes === 6 || mes === 7 || mes === 8) {
        return "summer";
    } // Si es Septiembre, Octubre o Noviembre devuelve otoño
    else if (mes === 9 || mes === 10 || mes === 11) {
        return "autumn";
    }

}

// Aplica los estilos a la tabla en función del mes
function aplicarEstilosPorEstacion(mes) {
    // Se cojen las filas de la tabla
    var filas = $("table tr");
    // Se comprueba la estación del año 
    var estacion = checkSeasons(mes);
    // Se añade la clase de la estación a la tabla y a las filas y celdas
    filas.each(function (index) {
        $(this).removeClass("spring summer autumn winter");
        $(this).addClass(estacion);
        $(this).removeClass("par impar");
        $(this).addClass((index + 1) % 2 == 0 ? "par" : "impar");

        var celdas = $(this).find("td");

        celdas.each(function (index) {
            $(this).removeClass("spring summer autumn winter");
            $(this).addClass(estacion);
            $(this).removeClass("par impar");
            $(this).addClass((index + 1) % 2 == 0 ? "par" : "impar");
        });
    });
}

