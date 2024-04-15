import chalk from "chalk";

/**
 * Enumeración que representa los colores de una carta.
 */
export enum CardColor {
  WHITE = "white",
  BLUE = "blue",
  BLACK = "black",
  RED = "red",
  GREEN = "green",
  COLORLESS = "colorless",
  MULTICOLORED = "multicolored",
}

/**
 * Enumeración que representa los tipos de una carta.
 */
export enum CardType {
  LAND = "Land",
  CREATURE = "Creature",
  ENCHANTMENT = "Enchantment",
  SORCERY = "Sorcery",
  INSTANT = "Instant",
  ARTIFACT = "Artifact",
  PLANESWALKER = "Planeswalker",
}

/**
 * Enumeración que representa las rarezas de una carta.
 */
export enum CardRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  MYTHIC = "mythic",
}

/**
 * Interfaz que define la estructura de una carta.
 */
export interface CardInterface {
  id: number;
  name: string;
  mana: number;
  cardColor: CardColor;
  cardType: CardType;
  cardRarity: CardRarity;
  rules: string;
  powerAndResistance: [number, number] | null;
  loyalty: number | null;
  value: number;
}

/**
 * Clase que representa una carta del juego.
 */
export class Card implements CardInterface {
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
}
