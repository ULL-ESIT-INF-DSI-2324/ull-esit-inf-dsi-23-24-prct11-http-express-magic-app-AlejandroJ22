import express from "express";

import { Card } from "./card.js";
import { CardCollection } from "./cardCollection.js";

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

export const server = express();
server.use(express.json()); // Para poder leer datos en JSON sin tener que trabajarlos.

/**
 * Ruta GET para obtener información sobre cartas.
 */
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

/**
 * Ruta POST para agregar una nueva carta.
 */
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

/**
 * Ruta PATCH para modificar una carta existente.
 */
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

/**
 * Ruta DELETE para eliminar una carta.
 */
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

server.listen(3000, () => {
  console.log("Server operativo en puerto 3000");
});
