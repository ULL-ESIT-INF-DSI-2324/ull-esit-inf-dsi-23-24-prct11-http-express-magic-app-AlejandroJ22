import "mocha";
import { expect } from "chai";
import chalk from "chalk";

import {
  Card,
  CardColor,
  CardType,
  CardRarity,
} from "../src/server_express/card.js";
import { CardCollection } from "../src/server_express/cardCollection.js";

describe("CardCollection Tests", () => {
  const collection = new CardCollection("testUser");

  // Descripción de pruebas para el método "Add Card"
  describe("Add Card", () => {
    it("should add a new card to the collection", () => {
      const newCard = new Card(
        1,
        "Test Card",
        2,
        CardColor.WHITE,
        CardType.CREATURE,
        CardRarity.COMMON,
        "Test rules",
        [2, 2],
        null,
        5,
      );
      return collection.addCard(newCard).then((successMessage) => {
        expect(successMessage).to.be.equal(
          `La carta ha sido ` +
            chalk.green(`añadida correctamente`) +
            ` a la colección.`,
        );
      });
    });
  });

  // Descripción de pruebas para el método "Update Card"
  describe("Update Card", () => {
    it("should update an existing card in the collection", () => {
      const updatedCard = new Card(
        1,
        "Updated Test Card",
        3,
        CardColor.BLUE,
        CardType.PLANESWALKER,
        CardRarity.UNCOMMON,
        "Updated rules",
        null,
        4,
        6,
      );
      return collection.updateCard(updatedCard).then((successMessage) => {
        expect(successMessage).to.be.equal(
          `La carta ha sido ` +
            chalk.green(`modificada correctamente`) +
            ` en la colección.`,
        );
      });
    });
  });

  // Descripción de pruebas para el método "Show Card Info"
  describe("Show Card Info", () => {
    it("should show information of a specific card in the collection", () => {
      return collection.showCardInfo(1).then((cardInfo) => {
        expect(cardInfo).to.include("Updated Test Card");
      });
    });

    it("should indicate if the specified card does not exist in the collection", () => {
      return collection.showCardInfo(0).catch((error) => {
        expect(error).to.include(
          "No existe una carta con el ID especificado en la colección",
        );
      });
    });
  });

  // Descripción de pruebas para el método "Remove Card"
  describe("Remove Card", () => {
    it("should remove a card from the collection", () => {
      return collection.removeCard(1).then((successMessage) => {
        expect(successMessage).to.be.equal(
          `La carta con ID 1 ha sido ` +
            chalk.green(`eliminada correctamente`) +
            ` de la colección.`,
        );
      });
    });
  });

  // Descripción de pruebas para el método "List Cards"
  describe("List Cards", () => {
    it("should list all cards in the collection", () => {
      const newCard1 = new Card(
        1,
        "Test Card 1",
        2,
        CardColor.WHITE,
        CardType.CREATURE,
        CardRarity.COMMON,
        "Test rules 1",
        [2, 2],
        null,
        5,
      );
      const newCard2 = new Card(
        2,
        "Test Card 2",
        3,
        CardColor.BLACK,
        CardType.SORCERY,
        CardRarity.RARE,
        "Test rules 2",
        null,
        null,
        6,
      );
      return collection.addCard(newCard1).then(() => {
        return collection.addCard(newCard2).then(() => {
          return collection.listCards().then((cardsList) => {
            expect(cardsList).to.include("Test Card 1");
            expect(cardsList).to.include("Test Card 2");
          });
        });
      });
    });
  });
});
