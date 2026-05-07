/*
* ENVIRONMENT (DESARROLLO)
* Define las variables de configuración para el entorno local.
* Nunca pongas API keys secretas aquí — este archivo se compila
* en el bundle y es visible en el navegador.
*/

export const environment = {
  // production: false indica que estamos en desarrollo
  production: false,

  /*
  * URL base de la Fake Store API
  * Todos los servicios HTTP la leen desde aquí — si la URL
  * cambia, solo modificas este archivo.
  */
  apiUrl: 'https://fakestoreapi.com',

  // Nombre de la app (útil para titles, logs, etc.)
  appName: 'FakeShop'
};

/*
* Angular no usa archivos .env de forma nativa en el navegador como
* React (vía process.env) porque Angular es un framework compilado (AOT).
* En su lugar, utiliza archivos environment.ts
*/
