//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoLista = document.querySelector('#gastos ul');


//eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gastos){
        this.gastos = [...this.gastos, gastos];
        console.log(this.gastos)
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        console.log(cantidad)
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('mensaje')
        
            if(tipo === 'error'){
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

    agregarGastoListado(gastos) {
        // console.log(gasto)
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.classList.add('listado');
            nuevoGasto.setAttribute('data-id', id);

            console.log(nuevoGasto)

            //agregar el html de gasto
            nuevoGasto.innerHTML = `${nombre} <span class=''>${cantidad}</span>`

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('crear-button')
            btnBorrar.textContent = 'Borrar'
            nuevoGasto.appendChild(btnBorrar)
            //agregar al HTML

            gastoLista.appendChild(nuevoGasto)
        })
    }
}

const ui = new UI();
let presupuesto;
let myDoughnutChart;


//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

    console.log(parseFloat(presupuestoUsuario))
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload()
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto);

}

//añade gastos
function agregarGasto(event) {
    event.preventDefault();
    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;

    //validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('ambos campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0  || isNaN(cantidad)) {
        ui.imprimirAlerta('cantidad no valida', 'error')

        return;
    }

    //generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}
    
    //añade un nuevo gasto
    presupuesto.nuevoGasto( gasto )

    //mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos
    const { gastos } = presupuesto;
    ui.agregarGastoListado(gastos);

    //reiniciar formulario
    formulario.reset();

    actualizarGrafico();
}

const getColors = opacity => {
    const colors = ['#7448c2', '#21c0d7', '#9c99cc', '#e14eca', '#ffffff', '#ff0000', '#d5ff00', '#ad34ff'];
    return colors.map(color => opacity ? `${color + opacity}` : color);
}

const printCharts = () => {
    renderModelsChart()
}

const renderModelsChart = () => {
    const data = {
        labels: presupuesto.gastos.map(gasto => gasto.nombre),
        datasets: [{
            data: presupuesto.gastos.map(gasto => gasto.cantidad),
            borderColor: getColors(),
            backgroundColor: getColors()
        }]
    }

    const ctx = document.getElementById('myDoughnutChart').getContext('2d');

    if(myDoughnutChart) {
        myDoughnutChart.destroy();
    }

    myDoughnutChart = new Chart(ctx, {type: 'doughnut', data})
}



const actualizarGrafico = () => {
    renderModelsChart();
}

// Inicializar gráfico en blanco
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('myDoughnutChart').getContext('2d');
    myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                borderColor: getColors(),
                backgroundColor: getColors()
            }]
        }
    });
});

printCharts()