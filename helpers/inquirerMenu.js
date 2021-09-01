require('colors');
const inquirer = require('inquirer');

const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: 'Seleccione una opcion',
    choices: [{
        value: 1,
        name:`${'1'.green} - Buscar Ciudad`
    }, 
    {
        value: 2,
        name: `${'2'.green} - Historial`
    },
    {
        value: 0,
        name: `${'3'.green} - Salir`
    }]
}];

async function mostrarMenu() {
    console.clear();

    console.log('====================================================================='.green)
    console.log('                        Administrador de clima                       ')
    console.log('====================================================================='.green)

    let  { opcion }  = await inquirer.prompt(preguntas);
    return opcion;

};

async function pausarMenu() {
    await inquirer.prompt([{
        type: 'input',
        name: 'enter',
        message: 'Presione ENTER para continuar'

    }])
};

async function escribirMenu() {
    const opciones = [{
        type: 'input',
        name: 'descripcion',
        message: 'Escribe la ciudad: ',
        validate: function(input) {
            if(!input) {
                console.log(`${'Importante'.red} - Debe escribir una ciudad`)
            } else {
                return true;
            }
        }
    }];

    const {descripcion} = await inquirer.prompt(opciones);

    return descripcion;
}

async function seleccionarCiudadMenu(ciudades = []){

    const ciudadesChoices = ciudades.map((elem, idx) => {
        const index = `${idx + 1}.`;
        return {
            value: elem.id,
            name: index.green + elem.nombre
        }
    });

    ciudadesChoices.unshift({
        value: 'exit',
        name: 'Salir'
    })

    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione una opcion\n',
        choices: ciudadesChoices
    }]

    const numeroRespuesta = await inquirer.prompt(preguntas);

    // console.log(numeroRespuesta.id)
    return numeroRespuesta.id;

}


module.exports = {
    mostrarMenu,
    pausarMenu,
    escribirMenu,
    seleccionarCiudadMenu
}