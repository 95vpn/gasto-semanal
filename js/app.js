

//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoLista = document.querySelector('#gastos ul');


//eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gastos) {
        this.gastos = [...this.gastos, gastos];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => +total + +gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado
        console.log(this.presupuesto)
        console.log(this.restante)
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante()
    }
}

class UI {
    insertarPresupuesto(cantidad) {

        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('mensaje')

        if (tipo === 'error') {
            divMensaje.classList.add('alert-error')
        } else {
            divMensaje.classList.add('alert-exito')
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en el HTML
        document.querySelector('.contenido-primario').insertBefore(divMensaje, formulario)

        //quitar el html
        setTimeout(() => {
            divMensaje.remove();
        }, 3000)
    }

    mostrarGastos(gastos) {
        this.limpiarHTML(); //elimina el html previo
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.style.textAlign = 'center'
            nuevoGasto.classList.add('listado');
            nuevoGasto.setAttribute('data-id', id);

            console.log(nuevoGasto)


            // Crear un elemento span para el nombre
            const nombreSpan = document.createElement('div');
            nombreSpan.textContent = nombre + ' ';
            nombreSpan.style.textAlign = 'center'

            // Crear un elemento span para la cantidad
            const cantidadSpan = document.createElement('div');
            cantidadSpan.textContent = '$' + cantidad;

            // Agregar los elementos span al nuevoGasto de manera segura
            nuevoGasto.appendChild(nombreSpan);
            nuevoGasto.appendChild(cantidadSpan);

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('crear-button')
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar)
            //agregar al HTML

            gastoLista.appendChild(nuevoGasto)
        })
    }
    limpiarHTML() {
        while (gastoLista.firstChild) {
            gastoLista.removeChild(gastoLista.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    };

    comprobarPresupuesto(presupuestoObj) {
        formulario.reset();
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        restanteDiv.classList.remove('restante-rojo', 'restante-amarillo', 'restante-normal');

        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.add('restante-rojo');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.add('restante-amarillo');
        } else {
            restanteDiv.classList.add('restante');
        }


        //Si el total es cero o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

const ui = new UI();
let presupuesto;
let myDoughnutChart;


//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

    console.log(parseFloat(presupuestoUsuario))
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);

}

//añade gastos
function agregarGasto(event) {
    event.preventDefault();
    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;

    //validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('cantidad no valida', 'error')
        return;
    }
    //generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto);

    //reiniciar formulario
    formulario.reset();

    actualizarGrafico();
}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gastos del html
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    actualizarGrafico();
}

const styles = {
    color: {
        solids: ['rgba(106, 252, 2, 1)', 'rgba(148, 212, 19, 1)', 'rgba(217, 158, 43, 1)', 'rgba(127, 165, 102, 1)', 'rgba(156, 153, 204, 1)', 'rgba(225, 78, 202, 1)'],
        alphas: ['rgba(106, 252, 2, .2)', 'rgba(148, 212, 19, .2)', 'rgba(217, 158, 43, .2)', 'rgba(127, 165, 102, .2)', 'rgba(156, 153, 204, .2)', 'rgba(225, 78, 202, .2)']
    }
}

const printCharts = () => {
    renderModelsChart()
}

const renderModelsChart = () => {
    if (presupuesto) {
        const data = {
            labels: ['Presupuesto', ...presupuesto.gastos.map(gasto => gasto.nombre)],
            datasets: [{
                data: [presupuesto.restante, ...presupuesto.gastos.map(gasto => gasto.cantidad)],
                borderWidth: 1,
                borderColor: styles.color.solids.map(eachColor => eachColor),
                backgroundColor: styles.color.alphas.map(eachColor => eachColor)
            }],
        }
        const options = {
            legend: {
                position: 'right',
                labels: {
                    fontColor: '#010101'
                }
            }
        }

        const ctx = document.getElementById('myDoughnutChart').getContext('2d');

        if (myDoughnutChart) {
            myDoughnutChart.destroy();
        }

        myDoughnutChart = new Chart(ctx, { type: 'doughnut', data, options })
    }

}

const actualizarGrafico = () => {
    renderModelsChart();
}

// Inicializar gráfico en blanco
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('myDoughnutChart').getContext('2d');

    if (myDoughnutChart) {
        myDoughnutChart.destroy();
    }
    myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presupuesto'],
            datasets: [{
                data: [presupuesto ? presupuesto.restante : 0],
                borderWidth: 1,
                borderColor: styles.color.solids.map(eachColor => eachColor),
                backgroundColor: styles.color.alphas.map(eachColor => eachColor)
            }]
        },
        options: {
            legend: {
                position: 'right',
                labels: {
                    fontColor: '#010101'
                }
            }
        }
    });
});

printCharts()