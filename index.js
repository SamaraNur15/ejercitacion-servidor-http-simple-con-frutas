const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

function  leerFrutas(){
  try{
    const data = fs.readFileSync(path.join(__dirname,'frutas.json'), 'utf-8');
    return JSON.parse(data);
  }
  catch (error){
    console.error('Error al leer el archivo frutas.json:', error);
    return [];
  }
}

// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Configurar el header de respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Obtener la ruta de la URL
  const path = url.parse(req.url).pathname;
  
  // TODO: Implementar el manejo de las siguientes rutas:
  // 1. '/' - Mensaje de bienvenida
  // 2. '/frutas/all' - Devolver todas las frutas
  if(path ==='/frutas/all'){
    const frutas = leerFrutas();
    res.statusCode = 200;
    res.end(JSON.stringify(frutas));
  } 
  
  // 3. '/frutas/id/123' - Devolver una fruta por su ID
  else if (path.startsWith('/frutas/id/')){
    const idSrt = path.split('/')[3];//Extrae el numero desde la URL
    const id = parseInt(idSrt);
    
    if(!isNaN(id)){
      const frutas = leerFrutas();
      const fruta = frutas.find(f => f.id === id);
      
      if (fruta){
        res.statusCode = 200;
        res.end(JSON.stringify(fruta));
      }
    }
  }  
  // 4. '/frutas/nombre/manzana' - Buscar frutas por nombre (parcial)
  else if (path.startsWith('/frutas/nombre/')){
    const nombreBuscado = path.split('/')[3].toLocaleLowerCase();

    const frutas = leerFrutas();
    const coincidencias = frutas.filter(f => f.nombre.toLocaleLowerCase().includes(nombreBuscado));
    
    if (coincidencias.length > 0){
      res.statusCode = 200;
      res.end(JSON.stringify(coincidencias));
    }
  }
  // 5. '/frutas/existe/manzana' - Verificar si existe una fruta
  else if (path.startsWith('/frutas/existe/')){
    const nombreBuscado = path.split('/')[3].toLowerCase();

    const frutas = leerFrutas();
    const existe = frutas.some(f => f.nombre.toLocaleLowerCase() === nombreBuscado);
    res.statusCode = 200;
    res.end(JSON.stringify({existe}));
  }
  
  // 6. Cualquier otra ruta - Error 404
  else {
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no válida' }));
  }
  // Por ahora, devolvemos un 404 para todas las rutas

});
// Iniciar el servidor
const PUERTO = 3001;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${PUERTO}/`);
  console.log(`- http://localhost:${PUERTO}/frutas/all`);
  console.log(`- http://localhost:${PUERTO}/frutas/id/:id`);
  console.log(`- http://localhost:${PUERTO}/frutas/nombre/:nombre`);
  console.log(`- http://localhost:${PUERTO}/frutas/existe/:nombre`);
});