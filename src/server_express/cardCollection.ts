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
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  addCard(newCard: Card): Promise<string>;

  /**
   * Actualiza una carta en la colección.
   * @param modifiedCard La carta modificada que se va a actualizar.
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  updateCard(modifiedCard: Card): Promise<string>;

  /**
   * Elimina una carta de la colección.
   * @param cardId El ID de la carta que se va a eliminar.
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  removeCard(cardId: number): Promise<string>;

  /**
   * Devuelve una cadena con la lista de cartas en la colección.
   * @returns Una promesa que se resuelve con la lista de cartas o se rechaza con un mensaje de error.
   */
  listCards(): Promise<string>;

  /**
   * Devuelve información detallada de una carta específica en la colección.
   * @param cardId El ID de la carta de la cual se quiere obtener la información.
   * @returns Una promesa que se resuelve con la información de la carta o se rechaza con un mensaje de error.
   */
  showCardInfo(cardId: number): Promise<string>;
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
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  private loadCards(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.collectionPath, (err, data) => {
        if (err) {
          if (err.code === "ENOENT") {
            resolve(
              `No se encontró el archivo ${this.collectionPath}, la colección se inicializará vacía.`,
            );
          } else {
            reject(
              chalk.red(`Error`) +
                `: no se ha conseguido leer el fichero ` +
                chalk.green(`${this.collectionPath}`),
            );
          }
        } else {
          try {
            const parsedData = JSON.parse(data.toString());
            if (!Array.isArray(parsedData)) {
              reject(
                chalk.red(`Error`) +
                  `: El archivo ${this.collectionPath} no contiene un array JSON válido.`,
              );
            } else {
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
              console.log("Cartas cargadas:", this.cards); // Agrega esta línea para depurar
              resolve(
                `Datos de la colección ` +
                  chalk.green(`cargados correctamente`) +
                  `.`,
              );
            }
          } catch (error) {
            reject(
              chalk.red(`Error`) +
                `: Error al analizar los datos JSON en ${this.collectionPath}.`,
            );
          }
        }
      });
    });
  }

  /**
   * Método privado que escribe las cartas en el archivo de colección.
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
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
          console.log("Cartas guardadas:", this.cards); // Agrega esta línea para depurar
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
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  addCard(newCard: Card): Promise<string> {
    this.loadCards()
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    return new Promise((resolve, reject) => {
      if (this.cards.has(newCard.id)) {
        reject(
          chalk.red(`Error`) +
            `: Ya existe una carta con el mismo ID en la colección.`,
        );
      } else {
        this.cards.set(newCard.id, newCard);
        console.log(this.cards);
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
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  updateCard(modifiedCard: Card): Promise<string> {
    this.loadCards()
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
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
   * @returns Una promesa que se resuelve con un mensaje de éxito o se rechaza con un mensaje de error.
   */
  removeCard(cardId: number): Promise<string> {
    this.loadCards()
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
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
   * @returns Una promesa que se resuelve con la lista de cartas o se rechaza con un mensaje de error.
   */
  listCards(): Promise<string> {
    this.loadCards()
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    return new Promise((resolve, reject) => {
      if (this.cards.size === 0) {
        reject(chalk.red(`Error`) + `: No hay cartas en la colección.`);
      } else {
        let cardListStr = chalk.green("Cartas en la colección:\n");
        this.cards.forEach((card) => {
          cardListStr += card.attributes();
        });
        resolve(cardListStr);
      }
    });
  }

  /**
   * Devuelve información detallada de una carta específica en la colección.
   * @param cardId El ID de la carta de la cual se quiere obtener la información.
   * @returns Una promesa que se resuelve con la información de la carta o se rechaza con un mensaje de error.
   */
  showCardInfo(cardId: number): Promise<string> {
    this.loadCards()
      .then((message) => console.log(message))
      .catch((error) => console.error(error));
    return new Promise((resolve, reject) => {
      const card = this.cards.get(cardId);
      if (card) {
        resolve(chalk.green("Información de la carta:\n") + card.attributes());
      } else {
        reject(
          chalk.red(`Error`) +
            `: No existe una carta con el ID especificado en la colección.`,
        );
      }
    });
  }
}
