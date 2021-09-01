const fs = require('fs');
const axios = require('axios');

class Busqueda {

   constructor() {
      this.historial = [];
      this.leerHistorial_db()
   };

   async ciudad(ciudad) {

      const instancia = axios.create({
         baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
         params: {
            "access_token": process.env.TOKEN_KEY,
            'cachebuster': '1628966812726',
            'autocomplete': 'true',
            'limit': '5',
            'language': 'es' 
         }
      })

      try {

         const datos = await instancia.get()

         const lugares = datos.data.features.map( elem => {
            return {
               id: elem.id,
               nombre: elem.place_name,
               lat: elem.center[1],
               long: elem.center[0]
            }
         });

         return lugares;

      } catch (error) {

         console.log(error)

      }
   };


   async clima(lat, lon) {
      const instancia = axios.create({
         baseURL: 'https://api.openweathermap.org/data/2.5/weather',
         params: {
            'lat':lat.toString(),
            'lon': lon.toString(),
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
         }
      })

      const climaTemp = await instancia.get();

      return {
         temp: climaTemp.data.main.temp,
         min: climaTemp.data.main.temp_min,
         max: climaTemp.data.main.temp_max,
         descripcion: climaTemp.data.weather[0].description
      }
   }

   GuardarHistorial_db(ciudad = '') {

      this.leerHistorial_db();
      
      if(this.historial.includes(ciudad)) return

      this.historial.unshift(ciudad);

      fs.writeFileSync('./db/historial.json', JSON.stringify(this.historial))

   }

   leerHistorial_db(){

      let existeArchivo = fs.existsSync('./db/historial.json') 


      if(existeArchivo){

         this.historial = JSON.parse(fs.readFileSync('./db/historial.json'))

      } else {        

         return;

      }
   }

}

module.exports = Busqueda;