[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/sNC2m9MU)

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/coveralls.yml)

[![Sonar-Cloud](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/build.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/build.yml)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-AlejandroJ22/actions/workflows/node.js.yml)

# Informe práctica 11 - Aplicación Express para coleccionistas de cartas Magic.

![Imagen ServerExpress](images/express.png)

## Alejandro Javier Aguiar Pérez
> [alu0101487168@ull.edu.es](mailto:alu0101487168@ull.edu.es)

## Índice
1. [Resumen](#resumen)
2. [Express](#express)
3. [Thunder Client](#thunder-client)
4. [Servidor](#servidor)
5. [Magic App](#magic-app)
    - [Clase Card](#clase-card)
    - [Clase CardCollection](#clase-cardcollection)
6. [Problemas](#problemas)
7. [Ejercicio PE](#ejercicio-pe)
8. [Referencias](#referencias)

## Resumen

En esta práctica, implementamos un servidor HTTP con Express para gestionar una colección de cartas de Magic: The Gathering. Los usuarios pueden realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en sus colecciones de cartas a través de peticiones HTTP utilizando métodos como POST, GET, PATCH y DELETE. El servidor almacena la información de las cartas en archivos JSON en el sistema de archivos, siguiendo la estructura de directorios por usuario establecida en prácticas anteriores.

Para implementar la funcionalidad requerida, creamos un servidor Express con rutas definidas en la ruta /cards para gestionar las operaciones sobre las cartas. Utilizamos los verbos HTTP adecuados (POST, GET, PATCH, DELETE) para cada operación, y cada petición lleva a cabo las acciones correspondientes en la colección de cartas del usuario.

> **[Volver al índice](#índice)**

## Express

Express es un marco de aplicación web para Node.js que simplifica el desarrollo de aplicaciones web y APIs. Ofrece una estructura mínima pero poderosa, con características como enrutamiento, middleware para manejar solicitudes y respuestas, integración con motores de plantillas, y soporte para middleware de terceros. Express permite a los desarrolladores crear aplicaciones web de manera rápida y eficiente, proporcionando flexibilidad y un alto rendimiento.

> **[Volver al índice](#índice)**

## Thunder Client

Thunder Client es una extensión para Visual Studio Code que proporciona un cliente HTTP integrado para realizar solicitudes HTTP y API testing directamente desde el editor. Permite a los desarrolladores enviar solicitudes HTTP GET, POST, PUT, DELETE, PATCH y OPTIONS, así como configurar encabezados personalizados, parámetros de consulta y cuerpo de solicitud. Además, ofrece características como autocompletado de URL, historial de solicitudes, guardar y cargar solicitudes, y compartir solicitudes a través de archivos JSON.

En el contexto del trabajo de implementar un servidor Express para una aplicación de coleccionistas de cartas, Thunder Client puede ser una herramienta útil para probar y depurar las rutas y controladores del servidor. Los desarrolladores pueden usar Thunder Client para enviar solicitudes HTTP a las rutas definidas en el servidor Express y verificar si las respuestas son las esperadas. Esto facilita el proceso de desarrollo al permitir una rápida iteración y depuración de la funcionalidad del servidor. Además, al utilizar Thunder Client, los desarrolladores pueden guardar las solicitudes de prueba relevantes y compartirlas con otros miembros del equipo para facilitar la colaboración y el trabajo conjunto en el proyecto.

> **[Volver al índice](#índice)**

## Servidor

Se implementa un servidor HTTP utilizando Express para gestionar una colección de cartas Magic. Este servidor permite realizar diversas operaciones, como agregar, modificar, eliminar, listar y mostrar cartas de un usuario específico. Además, utiliza una clase serverResponse para modelar las respuestas del servidor al cliente de manera estructurada.

Las características notables del código del servidor son las siguientes:

1. Uso de Express: el código comienza importando Express y creando una instancia del servidor utilizando express().
2. Middleware express.json(): se utiliza express.json() como middleware para analizar el cuerpo de las solicitudes entrantes en formato JSON. Esto facilita el manejo de los datos enviados desde el cliente en el cuerpo de la solicitud.
3. Manejo de rutas y solicitudes HTTP: se definen múltiples rutas utilizando los métodos HTTP GET, POST, PATCH y DELETE para manejar diferentes tipos de operaciones en la colección de cartas.

- GET

```ts
server.get("/cards", (req, res) => {
  if (!req.query.user) {
    const response = new serverResponse(
      false,
      undefined,
      "Error: No se ha definido un usuario.",
    );
    return res.status(400).json(response);
  } else {
    const userId = req.query.user as string;
    const cardId = req.query.id ? parseInt(req.query.id as string) : undefined;
    try {
      const collection = new CardCollection(userId);
      if (cardId !== undefined) {
        collection
          .showCardInfo(cardId)
          .then((cardInfo) => {
            const response = new serverResponse(true, cardInfo);
            res.json(response);
          })
          .catch((error) => {
            const response = new serverResponse(
              false,
              undefined,
              error.message,
            );
            res.status(400).json(response);
          });
      } else {
        collection
          .listCards()
          .then((cardList) => {
            const response = new serverResponse(true, cardList);
            res.json(response);
          })
          .catch((error) => {
            const response = new serverResponse(
              false,
              undefined,
              error.message,
            );
            res.status(400).json(response);
          });
      }
    } catch (error) {
      const response = new serverResponse(
        false,
        undefined,
        "Error: no se ha podido iniciar la colección de cartas.",
      );
      res.status(500).json(response);
    }
  }
});
```

- POST

```ts
server.post("/cards", (req, res) => {
  if (!req.query.user) {
    const response = new serverResponse(
      false,
      undefined,
      "No se ha definido un usuario.",
    );
    return res.status(400).json(response);
  } else {
    const userId = req.query.user as string;
    const collection = new CardCollection(userId);
    const newCardData = req.body;
    const newCard = new Card(
      newCardData.id,
      newCardData.name,
      newCardData.mana,
      newCardData.cardColor,
      newCardData.cardType,
      newCardData.cardRarity,
      newCardData.rules,
      newCardData.powerAndResistance,
      newCardData.loyalty,
      newCardData.value,
    );
    collection
      .addCard(newCard)
      .then((message) => {
        const response = new serverResponse(true, message);
        res.status(200).json(response);
      })
      .catch((error) => {
        const response = new serverResponse(false, undefined, error.message);
        res.status(400).json(response);
      });
  }
});
```

- PATCH

```ts
server.patch("/cards", (req, res) => {
  // console.log("PATCH request received");
  // console.log("Request body:", req.body);
  // console.log("Request query:", req.query);

  if (!req.query.user || !req.query.id) {
    const response = new serverResponse(
      false,
      undefined,
      "Se requiere un usuario y un ID de carta para modificarla.",
    );
    return res.status(400).json(response);
  } else {
    const userId = req.query.user as string;
    const cardId = parseInt(req.query.id as string);
    const modifiedCardData = req.body; // Aquí ya tenemos acceso directo al cuerpo de la solicitud analizado como JSON

    // console.log("User:", userId);
    // console.log("Card ID:", cardId);
    // console.log("Modified card data:", modifiedCardData);

    try {
      const collection = new CardCollection(userId);
      const modifiedCard = new Card(
        cardId,
        modifiedCardData.name,
        modifiedCardData.mana,
        modifiedCardData.cardColor,
        modifiedCardData.cardType,
        modifiedCardData.cardRarity,
        modifiedCardData.rules,
        modifiedCardData.powerAndResistance,
        modifiedCardData.loyalty,
        modifiedCardData.value,
      );

      collection
        .updateCard(modifiedCard)
        .then((message) => {
          // console.log("Update successful:", message);
          const response = new serverResponse(true, message);
          res.status(200).json(response);
        })
        .catch((error) => {
          // console.error("Update error:", error);
          const response = new serverResponse(false, undefined, error.message);
          res.status(400).json(response);
        });
    } catch (error) {
      // console.error("Collection initialization error:", error);
      const response = new serverResponse(
        false,
        undefined,
        "Error: no se ha podido iniciar la colección de cartas.",
      );
      res.status(500).json(response);
    }
  }
});
```

```ts
server.delete("/cards", (req, res) => {
  // console.log("DELETE request received");
  // console.log("Request query:", req.query);

  if (!req.query.user || !req.query.id) {
    const response = new serverResponse(
      false,
      undefined,
      "Se requiere un usuario y un ID de carta para eliminarla.",
    );
    return res.status(400).json(response);
  } else {
    const userId = req.query.user as string;
    const cardId = parseInt(req.query.id as string);

    // console.log("User:", userId);
    // console.log("Card ID:", cardId);

    try {
      const collection = new CardCollection(userId);
      collection
        .removeCard(cardId)
        .then((message) => {
          // console.log("Deletion successful:", message);
          const response = new serverResponse(true, message);
          res.status(200).json(response);
        })
        .catch((error) => {
          // console.error("Deletion error:", error);
          const response = new serverResponse(false, undefined, error.message);
          res.status(400).json(response);
        });
    } catch (error) {
      // console.error("Collection initialization error:", error);
      const response = new serverResponse(
        false,
        undefined,
        "Error: no se ha podido iniciar la colección de cartas.",
      );
      res.status(500).json(response);
    }
  }
});
```

4. Validación de parámetros de consulta: Antes de realizar cualquier operación, se valida la presencia de los parámetros de consulta necesarios. Por ejemplo, en la ruta GET /cards, se verifica si se ha definido un usuario.

5. Modelado de respuestas del servidor: Se define una clase serverResponse para modelar las respuestas del servidor al cliente. Esto ayuda a estructurar las respuestas de manera consistente y proporciona información sobre el éxito o fracaso de la operación, junto con mensajes opcionales.

```ts
/**
 * Clase que representa una respuesta del servidor al cliente.
 */
export class serverResponse {
  /**
   * Indica si la operación fue exitosa o no.
   */
  success: boolean;
  /**
   * El mensaje de la respuesta.
   */
  message?: string;
  /**
   * El error en caso de que la operación falle.
   */
  error?: string;

  /**
   * Constructor de la clase serverResponse.
   * @param success Indica si la operación fue exitosa o no.
   * @param message El mensaje de la respuesta.
   * @param error El error en caso de que la operación falle.
   */
  constructor(success: boolean, message?: string, error?: string) {
    this.success = success;
    this.message = message;
    this.error = error;
  }
}
```

6. Uso de promesas: Se emplea el uso de promesas para manejar operaciones asíncronas, como la lectura y escritura de archivos, y las operaciones de base de datos simuladas. Esto ayuda a evitar el anidamiento excesivo de callbacks y a escribir un código más legible y mantenible.

> **[Volver al índice](#índice)**

## Magic App

Al igual que en la anterior práctica se tuvo que modificar la clase cardCollection mientras que la clase car se mantuvo intacta.

### Clase Card

La clase *Card* representa una carta del juego Magic: The Gathering y tiene las siguientes opciones de diseño:

Esta clase no ha sufrido ningún cambio.

- **Constructor**: La clase tiene propiedades públicas que representan las características de una carta, como su ID, nombre, coste de mana, color, tipo, rareza, reglas, poder y resistencia (solo para *CRIATURAS*), lealtad (solo para *PLANESWALKERS*) y valor. Estas propiedades se inicializan en el constructor y son accesibles desde fuera de la clase. También cuenta con la **validación de atributos específicos** como lo son el poder y la resistencia para las *CRIATURAS*, o la lealtad para los *PLANESWALKERS*

```ts
/**
 * Constructor de la clase Card.
 * @param id El ID de la carta.
 * @param name El nombre de la carta.
 * @param mana El coste de mana de la carta.
 * @param cardColor El color de la carta.
 * @param cardType El tipo de la carta.
 * @param cardRarity La rareza de la carta.
 * @param rules Las reglas de la carta.
 * @param powerAndResistance El poder y resistencia de la carta (solo para criaturas).
 * @param loyalty La lealtad de la carta (solo para planeswalkers).
 * @param value El valor de la carta.
 */
constructor(
public id: number,
public name: string,
public mana: number,
public cardColor: CardColor,
public cardType: CardType,
public cardRarity: CardRarity,
public rules: string,
public powerAndResistance: [number, number] | null,
public loyalty: number | null,
public value: number,
) {
  this.id = id;
  this.name = name;
  this.mana = mana;
  this.cardColor = cardColor;
  this.cardType = cardType;
  this.cardRarity = cardRarity;
  if (this.cardType === CardType.CREATURE) {
    if (powerAndResistance === null) {
      throw new Error(
        "Una carta del tipo CRIATURA debe de tener asociada un atributo de fuerza/resistencia.",
      );
    }
    this.powerAndResistance = powerAndResistance;
  } else if (this.cardType === CardType.PLANESWALKER) {
    if (loyalty === null) {
      throw new Error(
        "Una carta del tipo PLANESWALKER debe de tener asociada un atributo de lealtad.",
      );
    }
    this.loyalty = loyalty;
  }
  this.value = value;
}
```

- **Método de representación de atributos**: la clase proporciona un método *attributes()* que devuelve una cadena con todas las características de la carta formateadas. Este método utiliza el paquete *chalk* para resaltar el color del texto en función del color de la carta.

```ts
/**
 * Método que devuelve una representación en cadena de las características de la carta.
 * @returns Una cadena que contiene las características de la carta.
 */
attributes(): string {
  let attributes = "Card Attributes:\n";
  attributes += `ID: ${this.id}\n`;
  attributes += `Name: ${this.name}\n`;
  attributes += `Mana: ${this.mana}\n`;
  attributes += `Color: `;
  switch (this.cardColor) {
    case CardColor.WHITE:
      attributes += chalk.white(this.cardColor) + "\n";
      break;
    case CardColor.BLUE:
      attributes += chalk.blue(this.cardColor) + "\n";
      break;
    case CardColor.BLACK:
      attributes += chalk.black(this.cardColor) + "\n";
      break;
    case CardColor.RED:
      attributes += chalk.red(this.cardColor) + "\n";
      break;
    case CardColor.GREEN:
      attributes += chalk.green(this.cardColor) + "\n";
      break;
    case CardColor.COLORLESS:
      attributes += chalk.gray(this.cardColor) + "\n";
      break;
    case CardColor.MULTICOLORED:
      attributes += chalk.yellow(this.cardColor) + "\n";
      break;
    default:
      attributes += this.cardColor + "\n";
  }
  attributes += `Type: ${this.cardType}\n`;
  attributes += `Rarity: ${this.cardRarity}\n`;
  attributes += `Rules: ${this.rules}\n`;
  if (this.powerAndResistance !== null)
    attributes += `Power: ${this.powerAndResistance[0]}, Resistance: ${this.powerAndResistance[1]}\n`;
  if (this.loyalty !== null) attributes += `Loyalty: ${this.loyalty}\n`;
  attributes += `Value: ${this.value}\n`;
  return attributes;
}
```

> **[Volver al índice](#índice)**

### Clase CardCollection

La clase cardCollection, como se ha comentado anteriormente, sufrió algunos cambios para esta práctica.

Aunque se pedía hacer uso del patrón callback, decidí usar promesas para controlar el flujo del programa, ya que en la pe habíamos modificado ya la práctica para que hiciese uso de las mismas y además como las promesas implementan de por si el patrón callback no vi mayor problema para usarlas.

Otras características importantes de la clase son:

- **Métodos de carga y escritura**: La clase tiene dos métodos *loadCards()* y *writeCards()* para cargar las cartas desde el archivo y escribir las cartas en el archivo, respectivamente. Estos métodos utilizan la **API asíncrona de Node.js** para trabajar con el sistema de archivos no como la anterior vez que se requería el uso de la API síncrona.

- **Métodos de interacción con la colección**: Los métodos *addCard()*, *updateCard()*, *removeCard()*, *listCards()* y *showCardInfo()* permiten al usuario **agregar**, **actualizar**, **eliminar**, **listar** y **ver** información detallada de las cartas en la colección. Si la función modifica algo de la colección se hace una llamada a *writeCards()* para guardar el estado de la colección en el .JSON.

- Se utilizan promesas rechazadas para manejar diferentes tipos de errores, como la falta de un archivo de colección, un formato JSON inválido o la ausencia de una carta con el ID especificado.

> **[Volver al índice](#índice)**

## Problemas

El servidor se despliega de manera correcta, pero a pesar de haber revisado el código una y otra vez no logro encontrar el error que sucede al usar cualquiera de las operaciones de GET, DELETE y PATCH, si usamos thunder client para probar las operaciones del servidor, solo funcionara la operación de POST para poder añadir una carta a la colección, esta operación crea el JSON, añade la carta al mapa que guarda la colección en la clase y escribe en el JSON. Pero a la hora de usar por ejemplo la operación GET para comprobar si la carta existe o no en la colección nos encontramos con un mensaje de error en que se dice que no existe una carta con ese id en la colección, lo cual no es cierto porque en el JSON se ha escrito la carta.

> **[Volver al índice](#índice)**

## Ejercicio PE

El ejercicio de la PE consistía en aplicar el uso de promesas sobre la antigua magicAPP que usaba el patron callback. Como las pormesas en si usan el patron callback, no costó demasiado cambiar el uso del patrón callback por el uso de promesas que simplemente usan resolve y reject para manejar los mensajes de éxito o error.

> **[Volver al índice](#índice)**

[Chalk](https://www.npmjs.com/package/chalk)
[Yargs](https://www.npmjs.com/package/yargs)
[Events](https://nodejs.org/docs/latest/api/events.html)
[fs](https://nodejs.org/docs/latest/api/fs.html)
[net](https://nodejs.org/docs/latest/api/net.html)