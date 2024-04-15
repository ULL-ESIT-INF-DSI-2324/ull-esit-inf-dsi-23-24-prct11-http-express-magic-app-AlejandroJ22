import "mocha";
import { expect } from "chai";
import chalk from "chalk";

import { Card, CardColor, CardType, CardRarity } from "../src/pe/card.js";

describe("Card", () => {
  // Prueba para verificar si el método showCard() retorna correctamente los atributos de la carta
  it("should return a string with card attributes", () => {
    const blackLotus = new Card(
      1,
      "Black Lotus",
      0,
      CardColor.COLORLESS,
      CardType.ARTIFACT,
      CardRarity.MYTHIC,
      "T: Sacrifice Black Lotus: Add three mana of any one color to your mana pool.",
      null,
      null,
      20000,
    );

    const expectedAttributes =
      `Card Attributes:\n` +
      `ID: 1\n` +
      `Name: Black Lotus\n` +
      `Mana: 0\n` +
      `Color: ${chalk.gray("colorless")}\n` +
      `Type: Artifact\n` +
      `Rarity: mythic\n` +
      `Rules: T: Sacrifice Black Lotus: Add three mana of any one color to your mana pool.\n` +
      `Value: 20000\n`;

    const cardAttributes = blackLotus.attributes();

    expect(cardAttributes).to.be.equal(expectedAttributes);
  });

  it("should have powerAndResistance attribute for creature type card", () => {
    const creatureCard = new Card(
      1,
      "Goblin Guide",
      1,
      CardColor.RED,
      CardType.CREATURE,
      CardRarity.COMMON,
      "Haste",
      [2, 2],
      null,
      5,
    );

    expect(creatureCard.powerAndResistance).to.be.deep.equal([2, 2]);
  });

  // Prueba para comprobar que se lanza un error al crear una carta de tipo criatura sin definir powerAndResistance
  it("should throw an error when creating a creature type card without defining powerAndResistance", () => {
    const createCreatureCardWithoutPowerAndResistance = () => {
      new Card(
        2,
        "Serra Angel",
        3,
        CardColor.WHITE,
        CardType.CREATURE,
        CardRarity.UNCOMMON,
        "Flying, Vigilance",
        null, // No se define powerAndResistance
        null,
        10,
      );
    };

    expect(createCreatureCardWithoutPowerAndResistance).to.throw(
      Error,
      "Una carta del tipo CRIATURA debe de tener asociada un atributo de fuerza/resistencia.",
    );
  });

  it("should have loyalty attribute for planeswalker type card", () => {
    const planeswalkerCard = new Card(
      1,
      "Liliana of the Veil",
      3,
      CardColor.BLACK,
      CardType.PLANESWALKER,
      CardRarity.MYTHIC,
      "+1: Each player discards a card.\n−2: Target player sacrifices a creature.\n−6: Separate all permanents target player controls into two piles. That player sacrifices all permanents in the pile of their choice.",
      null,
      3, // Loyalty value
      300,
    );

    expect(planeswalkerCard.loyalty).to.be.equal(3);
  });

  // Prueba para comprobar que se lanza un error al crear una carta de tipo Planeswalker sin definir loyalty
  it("should throw an error when creating a planeswalker type card without defining loyalty", () => {
    const createPlaneswalkerCardWithoutLoyalty = () => {
      new Card(
        2,
        "Chandra, Pyromaster",
        4,
        CardColor.RED,
        CardType.PLANESWALKER,
        CardRarity.MYTHIC,
        "+1: Chandra, Pyromaster deals 1 damage to target player or planeswalker and 1 damage to up to one target creature that player or that planeswalker's controller controls. That creature can't block this turn.\n−7: Exile the top ten cards of your library. Choose an instant or sorcery card exiled this way and copy it three times. You may cast the copies without paying their mana costs.",
        null,
        null, // No se define loyalty
        350,
      );
    };

    expect(createPlaneswalkerCardWithoutLoyalty).to.throw(
      Error,
      "Una carta del tipo PLANESWALKER debe de tener asociada un atributo de lealtad.",
    );
  });
});
