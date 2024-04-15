/* eslint-disable no-case-declarations */
import net from "net";
import { Card, CardInterface } from "./card.js";
import { CardCollection } from "./cardCollection.js";

/**
 * Crea un servidor TCP que maneja las solicitudes de los clientes para realizar operaciones en una colección de cartas.
 * @param connection El objeto de conexión del cliente.
 */
const server = net.createServer((connection) => {
  console.log("Cliente conectado.");

  connection.on("data", (dataJSON) => {
    console.log("Mensaje recibido.");
    const message = JSON.parse(dataJSON.toString());
    const { user, action, ...data } = message;
    console.log(message);

    // Inicializa la colección de cartas para el usuario actual
    // const collection = new CardCollection(user, (message) => {
    //   // Envía una respuesta al cliente
    //   connection.write(JSON.stringify({ message }));
    // });
    const collection = new CardCollection(user);

    switch (action) {
      case "add":
        const newCard = createCardFromData(data);
        const addPromise = collection.addCard(newCard);
        addPromise.then((successMessage) => {
          // console.log(successMessage);
          connection.write(JSON.stringify({ message: successMessage }));
        }).catch((errorMessage) => {
          // console.log(errorMessage);
          connection.write(JSON.stringify({ message: errorMessage }));
        });
        break;
      case "update":
        const updatedCard = createCardFromData(data);
        const updatePromise = collection.addCard(updatedCard);
        updatePromise.then((successMessage) => {
          // console.log(successMessage);
          connection.write(JSON.stringify({ message: successMessage }));
        }).catch((errorMessage) => {
          // console.log(errorMessage);
          connection.write(JSON.stringify({ message: errorMessage }));
        });
        break;
      case "read":
        collection.showCardInfo(data.id, (cardInfo, errorMessage) => {
          const response = errorMessage ? errorMessage : cardInfo;
          connection.write(JSON.stringify({ message: response }));
        });
        break;
      case "list":
        collection.listCards((cardList, errorMessage) => {
          const response = errorMessage ? errorMessage : cardList;
          connection.write(JSON.stringify({ message: response }));
        });
        break;
      case "remove":
        const removePromise = collection.removeCard(data.id);
        removePromise.then((successMessage) => {
          // console.log(successMessage);
          connection.write(JSON.stringify({ message: successMessage }));
        }).catch((errorMessage) => {
          // console.log(errorMessage);
          connection.write(JSON.stringify({ message: errorMessage }));
        });
        break;
      default:
        connection.write(JSON.stringify({ message: "Comando no reconocido" }));
    }
  });

  /**
   * Maneja el evento de cierre de la conexión del cliente.
   */
  connection.on("close", () => {
    console.log("Un cliente se ha desconectado");
  });

  /**
   * Maneja los errores de la conexión del cliente.
   * @param error El error producido.
   */
  connection.on("error", (error) => {
    console.error("Error:", error);
  });
});

/**
 * Inicia el servidor en el puerto 60300.
 */
server.listen(60300, () => {
  console.log("Esperando clientes.");
});

/**
 * Crea una instancia de la clase Card utilizando los datos proporcionados.
 * @param data Los datos de la carta.
 * @returns Una nueva instancia de la clase Card.
 */
function createCardFromData(data: CardInterface): Card {
  return new Card(
    data.id,
    data.name,
    data.mana,
    data.cardColor,
    data.cardType,
    data.cardRarity,
    data.rules,
    data.powerAndResistance,
    data.loyalty,
    data.value,
  );
}