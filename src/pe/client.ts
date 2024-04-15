import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Card, CardColor, CardType, CardRarity } from "./card.js";

/**
 * Crea un cliente TCP que se conecta al servidor para enviar solicitudes relacionadas con una colección de cartas.
 */
const client = net.connect({ port: 60300 });

/**
 * Maneja el evento de conexión exitosa al servidor.
 */
client.on('connect', () => {
  // console.log("Enviando mensaje al servidor.");
  // client.write(JSON.stringify(process.argv));
  console.log("Conectado al servidor");
  yargs(hideBin(process.argv))
  .command(
    "add",
    "Añadir una nueva carta a la colección",
    {
      user: {
        describe: "Nombre de usuario",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "ID de la carta",
        demandOption: true,
        type: "number",
      },
      name: {
        describe: "Nombre de la carta",
        demandOption: true,
        type: "string",
      },
      mana: {
        describe: "Coste de maná de la carta",
        demandOption: true,
        type: "number",
      },
      color: {
        describe: "Color de la carta",
        demandOption: true,
        choices: Object.values(CardColor),
        type: "string",
      },
      type: {
        describe: "Tipo de la carta",
        demandOption: true,
        choices: Object.values(CardType),
        type: "string",
      },
      rarity: {
        describe: "Rareza de la carta",
        demandOption: true,
        choices: Object.values(CardRarity),
        type: "string",
      },
      rules: {
        describe: "Reglas de la carta",
        demandOption: true,
        type: "string",
      },
      power: {
        describe: "Poder de la carta (solo para criaturas)",
        type: "number",
      },
      resistance: {
        describe: "Resistencia de la carta (solo para criaturas)",
        type: "number",
      },
      loyalty: {
        describe: "Lealtad de la carta (solo para planeswalkers)",
        type: "number",
      },
      value: {
        describe: "Valor de la carta",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      let powerAndResistance: [number, number] | null = null;
      let loyalty: number | null = null;

      if (
        argv.type === CardType.CREATURE &&
        typeof argv.power === "number" &&
        typeof argv.resistance === "number"
      ) {
        powerAndResistance = [argv.power, argv.resistance];
      }

      if (
        argv.type === CardType.PLANESWALKER &&
        typeof argv.loyalty === "number"
      ) {
        loyalty = argv.loyalty;
      }

      const newCard = new Card(
        argv.id,
        argv.name,
        argv.mana,
        argv.color as CardColor,
        argv.type as CardType,
        argv.rarity as CardRarity,
        argv.rules,
        powerAndResistance,
        loyalty,
        argv.value,
      );
      console.log("Enviando mensaje al servidor.");
      // Crear el mensaje JSON con la acción y los datos
      const message = JSON.stringify({
        user: argv.user,
        action: "add",
        card: newCard
      });
      // Enviar el mensaje al servidor
      client.write(message);
      client.end();
    },
  )
  .command(
    "update",
    "Actualizar una carta existente en la colección",
    {
      user: {
        describe: "Nombre de usuario",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "ID de la carta",
        demandOption: true,
        type: "number",
      },
      name: {
        describe: "Nombre de la carta",
        demandOption: true,
        type: "string",
      },
      mana: {
        describe: "Coste de maná de la carta",
        demandOption: true,
        type: "number",
      },
      color: {
        describe: "Color de la carta",
        demandOption: true,
        choices: Object.values(CardColor),
        type: "string",
      },
      type: {
        describe: "Tipo de la carta",
        demandOption: true,
        choices: Object.values(CardType),
        type: "string",
      },
      rarity: {
        describe: "Rareza de la carta",
        demandOption: true,
        choices: Object.values(CardRarity),
        type: "string",
      },
      rules: {
        describe: "Reglas de la carta",
        demandOption: true,
        type: "string",
      },
      power: {
        describe: "Poder de la carta (solo para criaturas)",
        type: "number",
      },
      resistance: {
        describe: "Resistencia de la carta (solo para criaturas)",
        type: "number",
      },
      loyalty: {
        describe: "Lealtad de la carta (solo para planeswalkers)",
        type: "number",
      },
      value: {
        describe: "Valor de la carta",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      let powerAndResistance: [number, number] | null = null;
      let loyalty: number | null = null;

      if (
        argv.type === CardType.CREATURE &&
        typeof argv.power === "number" &&
        typeof argv.resistance === "number"
      ) {
        powerAndResistance = [argv.power, argv.resistance];
      }

      if (
        argv.type === CardType.PLANESWALKER &&
        typeof argv.loyalty === "number"
      ) {
        loyalty = argv.loyalty;
      }

      const newCard = new Card(
        argv.id,
        argv.name,
        argv.mana,
        argv.color as CardColor,
        argv.type as CardType,
        argv.rarity as CardRarity,
        argv.rules,
        powerAndResistance,
        loyalty,
        argv.value,
      );
      console.log("Enviando mensaje al servidor.");
      // Crear el mensaje JSON con la acción y los datos
      const message = JSON.stringify({
        user: argv.user,
        action: "update",
        card: newCard
      });
      // Enviar el mensaje al servidor
      client.write(message);
      client.end();
    },
  )
  .command(
    "read",
    "Mostrar la información de una carta de la colección",
    {
      user: {
        describe: "Nombre de usuario",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "ID de la carta",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      console.log("Enviando mensaje al servidor.");
      // Crear el mensaje JSON con la acción y los datos
      const message = JSON.stringify({
        user: argv.user,
        action: "read"
      });
      // Enviar el mensaje al servidor
      client.write(message);
      client.end();
    },
  )
  .command(
    "list",
    "Mostrar todas las cartas de la colección",
    {
      user: {
        describe: "Nombre de usuario",
        demandOption: true,
        type: "string",
      },
    },
    (argv) => {
      console.log("Enviando mensaje al servidor.");
      // Crear el mensaje JSON con la acción y los datos
      const message = JSON.stringify({
        user: argv.user,
        action: "list"
      });
      // Enviar el mensaje al servidor
      client.write(message);
      client.end();
    },
  )
  .command(
    "remove",
    "Eliminar una carta de la colección",
    {
      user: {
        describe: "Nombre de usuario",
        demandOption: true,
        type: "string",
      },
      id: {
        describe: "ID de la carta",
        demandOption: true,
        type: "number",
      },
    },
    (argv) => {
      console.log("Enviando mensaje al servidor.");
      // Crear el mensaje JSON con la acción y los datos
      const message = JSON.stringify({
        user: argv.user,
        action: "remove",
        id: argv.id
      });
      // Enviar el mensaje al servidor
      client.write(message);
      client.end();
    },
  )
  .demandCommand(1, "Usa algún comando.")
  .help().argv;
});

/**
 * Maneja los datos recibidos del servidor
 */
let wholeData = "";
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

/**
 * Maneja el evento de cierre de la conexión
 */
client.on('end', () => {
  try {
    const message = JSON.parse(wholeData);
    console.log(`${message.message}`);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  } finally {
    client.end();
  }
});

/**
 * Maneja el evento de cierre de la conexión
 */
client.on("close", () => {
  console.log("Conexión cerrada");
});
