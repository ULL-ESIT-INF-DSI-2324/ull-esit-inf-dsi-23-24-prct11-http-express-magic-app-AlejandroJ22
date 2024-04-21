import "mocha";
import { expect } from "chai";
import chalk from "chalk";

import request from "request";
import { server } from "../src/server_express/server.js";

// Importamos el servidor antes d ela ejecución de los test
server;

// const baseUrl = "http://localhost:3000";

// describe("Server Tests", () => {
//   describe("GET /cards", () => {
//     it("should return an error when no user is provided", (done) => {
//       request.get(`${baseUrl}/cards`, (error, response, body) => {
//         expect(response.statusCode).to.equal(400);
//         expect(JSON.parse(body)).to.deep.equal({
//           error: "Error: No se ha definido un usuario.",
//         });
//         done();
//       });
//     });
// it("debería listar todas las cartas si no se proporciona cartaId", (done) => {
//   request.get(
//     `${baseUrl}/cards?user=testUser`,
//     { json: true },
//     (error, res, body) => {
//       if (error) {
//         done(error);
//       } else {
//         expect(res.statusCode).to.equal(200);
//         expect(body)
//           .to.have.property("cards")
//           .that.is.an("array")
//           .with.length.above(0);
//         const cards = body.cards.map((card) => card.attributes());
//         expect(cards).to.deep.include({ id: 2 }); // Ajusta el id de la carta según tu colección
//         expect(cards).to.deep.include({ name: "Nombre de la carta" }); // Ajusta el nombre de la carta según tu colección
//         // Ajusta otras propiedades de la carta según tu colección
//         done();
//       }
//     },
//   );
// });

// Agrega más pruebas GET aquí para cubrir otros casos de uso
//   });
// });

// Añadir chalk y control de flujo en json collection
describe("POST /cards", () => {
  it("debería añadir una nueva carta a la colección del usuario", (done) => {
    const newCardData = {
      id: 123,
      name: "Nueva Carta",
      mana: 3,
      cardColor: "Azul",
      cardType: "Criatura",
      cardRarity: "Común",
      rules: "Reglas de la nueva carta",
      powerAndResistance: [2, 3],
      loyalty: null,
      value: 5,
    };

    request.post(
      {
        url: "http://localhost:3000/cards?user=testServerUser",
        json: true,
        body: newCardData,
      },
      (error, response, body) => {
        if (error) {
          return done(error);
        }
        expect(response.statusCode).to.equal(200);
        expect(body.success).to.be.true;
        expect(body.message).to.equal(
          `La carta ha sido ` +
            chalk.green(`añadida correctamente`) +
            ` a la colección.`,
        );
        done();
      },
    );
  });
});

describe("PATCH /cards", () => {
  it("debería actualizar una carta en la colección del usuario", (done) => {
    const cardIdToUpdate = 123;
    const modifiedCardData = {
      name: "Nueva Carta Modificada",
      mana: 4,
      cardColor: "Rojo",
      cardType: "Hechizo",
      cardRarity: "Rara",
      rules: "Reglas de la carta modificada",
      powerAndResistance: [3, 2],
      loyalty: null,
      value: 6,
    };

    request.patch(
      {
        url: `http://localhost:3000/cards?user=testServerUser&id=${cardIdToUpdate}`,
        json: true,
        body: modifiedCardData,
      },
      (error, response, body) => {
        if (error) {
          return done(error);
        }
        expect(response.statusCode).to.equal(200);
        expect(body.success).to.be.true;
        expect(body.message).to.equal(
          `La carta ha sido modificada correctamente en la colección.`,
        );
        done();
      },
    );
  });
});

describe("DELETE /cards", () => {
  it("debería eliminar una carta de la colección del usuario", (done) => {
    const cardIdToRemove = 123;

    request.delete(
      {
        url: `http://localhost:3000/cards?user=testServerUser&id=${cardIdToRemove}`,
        json: true,
      },
      (error, response, body) => {
        if (error) {
          return done(error);
        }
        expect(response.statusCode).to.equal(200);
        expect(body.success).to.be.true;
        expect(body.message).to.equal(
          `La carta con ID ${cardIdToRemove} ha sido eliminada correctamente de la colección.`,
        );
        done();
      },
    );
  });
});
