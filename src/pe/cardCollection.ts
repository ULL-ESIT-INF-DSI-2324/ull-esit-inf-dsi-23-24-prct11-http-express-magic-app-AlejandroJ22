import { Card } from "./card.js";

import fs from "fs";
import chalk from "chalk";

/**
 * Interfaz que describe los métodos públicos de la clase CardCollection.
 */
export interface CardCollectionInterface {
  /**
   * Añade una nueva carta a la colección.
   * @param newCard La nueva carta que se va a añadir.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  addCard(
    newCard: Card,
    callback: (successMessage: string, errorMessage: string | null) => void,
  ): void;

  /**
   * Actualiza una carta en la colección.
   * @param modifiedCard La carta modificada que se va a actualizar.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  updateCard(
    modifiedCard: Card,
    callback: (successMessage: string, errorMessage: string | null) => void,
  ): void;

  /**
   * Elimina una carta de la colección.
   * @param cardId El ID de la carta que se va a eliminar.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  removeCard(
    cardId: number,
    callback: (successMessage: string, errorMessage: string | null) => void,
  ): void;

  /**
   * Devuelve una cadena con la lista de cartas en la colección.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  listCards(
    callback: (cardList: string, errorMessage: string | null) => void,
  ): void;

  /**
   * Devuelve información detallada de una carta específica en la colección.
   * @param cardId El ID de la carta de la cual se quiere obtener la información.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  showCardInfo(
    cardId: number,
    callback: (cardInfo: string, errorMessage: string | null) => void,
  ): void;
}

/**
 * Clase que representa una colección de cartas.
 */
export class CardCollection implements CardCollectionInterface {
  /**
   * El nombre de usuario asociado a la colección.
   */
  public readonly username: string;
  /**
   * La ruta del archivo de la colección.
   */
  private readonly collectionPath: string;
  /**
   * Mapa que contiene las cartas en la colección, donde la clave es el ID de la carta.
   */
  private cards: Map<number, Card>;

  /**
   * Constructor de la clase CardCollection.
   * @param username El nombre de usuario asociado a la colección.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  // constructor(username: string, callback: (message: string | null) => void) {
  //   this.username = username;
  //   this.collectionPath = `./collections/${this.username}.json`;
  //   this.cards = new Map<number, Card>();

  //   if (!fs.existsSync(this.collectionPath)) {
  //     this.writeCards(callback);
  //   } else {
  //     this.loadCards(callback);
  //   }
  // }
  constructor(username: string) {
    this.username = username;
    this.collectionPath = `./collections/${this.username}.json`;
    this.cards = new Map<number, Card>();

    if (fs.existsSync(this.collectionPath)) {
      this.loadCards()
        .then((message) => console.log(message))
        .catch((error) => console.error(error));
    } else {
      this.writeCards()
        .then((message) => console.log(message))
        .catch((error) => console.error(error));
    }
  }

  /**
   * Método privado que carga las cartas desde el archivo de colección.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  // private loadCards(callback: (message: string | null) => void): void {
  //   fs.readFile(this.collectionPath, (err, data) => {
  //     if (err) {
  //       callback(
  //         chalk.red(`Error`) +
  //           `: no se ha conseguido leer el fichero ` +
  //           chalk.green(`${this.collectionPath}`),
  //       );
  //     } else {
  //       const parsedData = JSON.parse(data.toString());
  //       for (const cardData of parsedData) {
  //         const card = new Card(
  //           cardData.id,
  //           cardData.name,
  //           cardData.mana,
  //           cardData.cardColor,
  //           cardData.cardType,
  //           cardData.cardRarity,
  //           cardData.rules,
  //           cardData.powerAndResistance,
  //           cardData.loyalty,
  //           cardData.value,
  //         );
  //         this.cards.set(card.id, card);
  //       }
  //       callback(
  //         `Datos de la colección ` +
  //           chalk.green(`cargados correctamente`) +
  //           `.`,
  //       );
  //     }
  //   });
  // }
  private loadCards(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.collectionPath, (err, data) => {
        if (err) {
          reject(
            chalk.red(`Error`) +
              `: no se ha conseguido leer el fichero ` +
              chalk.green(`${this.collectionPath}`),
          );
        } else {
          const parsedData = JSON.parse(data.toString());
          for (const cardData of parsedData) {
            const card = new Card(
              cardData.id,
              cardData.name,
              cardData.mana,
              cardData.cardColor,
              cardData.cardType,
              cardData.cardRarity,
              cardData.rules,
              cardData.powerAndResistance,
              cardData.loyalty,
              cardData.value,
            );
            this.cards.set(card.id, card);
          }
          resolve(
            `Datos de la colección ` +
              chalk.green(`cargados correctamente`) +
              `.`,
          );
        }
      });
    });
  }

  /**
   * Método que escribe las cartas en el archivo de colección.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  // private writeCards(callback: (message: string | null) => void): void {
  //   const cardsData = JSON.stringify([...this.cards.values()], null, 2);
  //   fs.writeFile(this.collectionPath, cardsData, (err) => {
  //     if (err) {
  //       callback(
  //         chalk.red(`Error`) +
  //           `: No se pudo escribir en el archivo ${this.collectionPath}.`,
  //       );
  //     } else {
  //       callback(
  //         `Estado de la colección ` +
  //           chalk.green(`escrito correctamente`) +
  //           ` en el archivo ${this.collectionPath}.`,
  //       );
  //     }
  //   });
  // }
  private writeCards(): Promise<string> {
    return new Promise((resolve, reject) => {
      const cardsData = JSON.stringify([...this.cards.values()], null, 2);
      fs.writeFile(this.collectionPath, cardsData, (err) => {
        if (err) {
          reject(
            chalk.red(`Error`) +
              `: No se pudo escribir en el archivo ${this.collectionPath}.`,
          );
        } else {
          resolve(
            `Estado de la colección ` +
              chalk.green(`escrito correctamente`) +
              ` en el archivo ${this.collectionPath}.`,
          );
        }
      });
    });
  }

  /**
   * Añade una nueva carta a la colección.
   * @param newCard La nueva carta que se va a añadir.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  // addCard(
  //   newCard: Card,
  //   callback: (successMessage: string, errorMessage: string | null) => void,
  // ): void {
  //   if (this.cards.has(newCard.id)) {
  //     callback(
  //       "",
  //       chalk.red(`Error`) +
  //         `: Ya existe una carta con el mismo ID en la colección.`,
  //     );
  //   } else {
  //     this.cards.set(newCard.id, newCard);
  //     this.writeCards((message) => {
  //       if (message) {
  //         callback(
  //           `La carta ha sido ` +
  //             chalk.green(`añadida correctamente`) +
  //             ` a la colección.`,
  //           "",
  //         );
  //       } else {
  //         callback("", message);
  //       }
  //     });
  //   }
  // }
  addCard(newCard: Card): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cards.has(newCard.id)) {
        reject(
          chalk.red(`Error`) +
            `: Ya existe una carta con el mismo ID en la colección.`,
        );
      } else {
        this.cards.set(newCard.id, newCard);
        this.writeCards()
          .then(() =>
            resolve(
              `La carta ha sido ` +
                chalk.green(`añadida correctamente`) +
                ` a la colección.`,
            ),
          )
          .catch((error) => reject(error));
      }
    });
  }

  /**
   * Actualiza una carta en la colección.
   * @param modifiedCard La carta modificada que se va a actualizar.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  updateCard(modifiedCard: Card): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cards.has(modifiedCard.id)) {
        this.cards.set(modifiedCard.id, modifiedCard);
        this.writeCards()
          .then(() =>
            resolve(
              `La carta ha sido ` +
                chalk.green(`modificada correctamente`) +
                ` en la colección.`,
            ),
          )
          .catch((error) => reject(error));
      } else {
        reject(
          chalk.red(`Error`) +
            `: No existe una carta con el ID especificado en la colección.`,
        );
      }
    });
  }

  /**
   * Elimina una carta de la colección.
   * @param cardId El ID de la carta que se va a eliminar.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  removeCard(cardId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.cards.has(cardId)) {
        this.cards.delete(cardId);
        this.writeCards()
          .then(() =>
            resolve(
              `La carta con ID ${cardId} ha sido ` +
                chalk.green(`eliminada correctamente`) +
                ` de la colección.`,
            ),
          )
          .catch((error) => reject(error));
      } else {
        reject(
          chalk.red(`Error`) +
            `: No existe una carta con el ID especificado en la colección.`,
        );
      }
    });
  }

  /**
   * Devuelve una cadena con la lista de cartas en la colección.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  listCards(
    callback: (cardList: string, errorMessage: string | null) => void,
  ): void {
    let cardListStr = chalk.green("Cartas en la colección:\n");
    this.cards.forEach((card) => {
      cardListStr += card.attributes();
    });
    callback(cardListStr, "");
  }

  /**
   * Devuelve información detallada de una carta específica en la colección.
   * @param cardId El ID de la carta de la cual se quiere obtener la información.
   * @param callback Función de devolución de llamada que maneja el resultado de la operación.
   */
  showCardInfo(
    cardId: number,
    callback: (cardInfo: string, errorMessage: string | null) => void,
  ): void {
    const card = this.cards.get(cardId);
    if (card) {
      callback(
        chalk.green("Información de la carta:\n") + card.attributes(),
        "",
      );
    } else {
      callback(
        "",
        chalk.red(`Error`) +
          `: No existe una carta con el ID especificado en la colección.`,
      );
    }
  }
}
