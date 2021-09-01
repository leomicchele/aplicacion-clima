require('dotenv').config()
require('colors')

const { mostrarMenu, pausarMenu, escribirMenu,seleccionarCiudadMenu } = require("./helpers/inquirerMenu");
const Busqueda = require("./models/Busqueda.js");



async function main() {
  let opcion;
  const Peticiones = new Busqueda() // instanciamos la clase

  do {
    // El usuario selecciona una opcion
    opcion = await mostrarMenu();

    switch (opcion) {
      case 1:
        // Esperando el input del usuario
        const inputBusqueda = await escribirMenu()

        // mandamos el input del usuario al metodo de la clase, nos devuelve un array
        const lugares = await Peticiones.ciudad(inputBusqueda)

        // mandamos el array con las ciudades, nos devuelve el ID
        const idSeleccionado = await seleccionarCiudadMenu(lugares)

        // SI el usuario elige salir, se termina el Switch
        if(idSeleccionado === 'exit') continue;

        // comparamos el ID obtenido con todas las ciudades que coniciden
        const ciudadSeleccionada = lugares.find((elem => {
          return elem.id == idSeleccionado
        }))

        // Lo guardamos en el Historial
        Peticiones.GuardarHistorial_db(ciudadSeleccionada.nombre)

        // Hacemos la peticion a OpenWeather para el clima
        const climaTemperatura = await Peticiones.clima(ciudadSeleccionada.lat, ciudadSeleccionada.long)

        
        // Muestra Resultados en consola
        console.clear()
        console.log('\nInformación de la ciudad\n'.toUpperCase().green)
        console.log('Ciudad: ', `${ciudadSeleccionada.nombre}`.bold.blue);
        console.log('Lat: ', `${ciudadSeleccionada.lat}`.green);
        console.log('Long: ', `${ciudadSeleccionada.long}`.green);
        console.log(`Temperatura Actual: ${climaTemperatura.temp.toFixed(1).bold.yellow} °C` );
        console.log(`Minima: ${climaTemperatura.min.toFixed(1).bold.cyan} °C`);
        console.log(`Maxima: ${climaTemperatura.max.toFixed(1).bold.brightRed} °C`);
        console.log(`Descripcion: ${climaTemperatura.descripcion.green}\n`);


      break;

      case 2:
        Peticiones.leerHistorial_db()

        Peticiones.historial.forEach(element => {
          console.log(`- ${element}`.green)
        });
        
        // console.log(Peticiones.historial);
      break;
    }

    if(opcion !== 0) await pausarMenu();


  }  while (opcion == 1 || opcion == 2)

  process.exit();
}

main();
