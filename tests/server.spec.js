const request = require("supertest");
const server = require("../index"); // Importamos el servidor desde el archivo principal

describe("Operaciones CRUD de cafes", () => {

    // 1. Test para la ruta GET /cafes
    it("Debe devolver un status 200 y un arreglo con al menos un objeto", async () => {
        const response = await request(server).get("/cafes").send();
        
        // Comprueba que el status code sea 200
        expect(response.statusCode).toBe(200);

        // Comprueba que el cuerpo de la respuesta sea un arreglo (Array)
        expect(response.body).toBeInstanceOf(Array);

        // Comprueba que el arreglo no esté vacío
        expect(response.body.length).toBeGreaterThan(0);
    });

    // 2. Test para la ruta DELETE /cafes/:id con un id que no existe
    it("Debe devolver un status 404 al intentar eliminar un cafe con un id que no existe", async () => {
        const jwt = "token_de_prueba"; // El servidor solo verifica que el token exista, no su validez.
        const idDeCafeInexistente = 999;

        const response = await request(server)
            .delete(`/cafes/${idDeCafeInexistente}`)
            .set("Authorization", jwt) // La ruta DELETE requiere un token en la cabecera
            .send();

        // Comprueba que el status code sea 404
        expect(response.statusCode).toBe(404);
    });

    // 3. Test para la ruta POST /cafes
    it("Debe agregar un nuevo café y devolver un status 201", async () => {
        // Creamos un nuevo cafe con un ID que sabemos que no existe
        const nuevoCafe = { id: 5, nombre: "Latte" };

        const response = await request(server).post("/cafes").send(nuevoCafe);

        // Comprueba que el status code sea 201 (Creado)
        expect(response.statusCode).toBe(201);
        
        // Comprueba que la respuesta (el arreglo actualizado) contenga el nuevo cafe
        expect(response.body).toContainEqual(nuevoCafe);
    });

    // 4. Test para la ruta PUT /cafes/:id con IDs que no coinciden
    it("Debe devolver un status 400 si el id del parámetro no coincide con el id del payload", async () => {
        // ID en la URL del parametro
        const idParametro = 1;
        // Payload con un ID diferente
        const cafePayload = { id: 2, nombre: "Mocaccino Frio" };

        const response = await request(server).put(`/cafes/${idParametro}`).send(cafePayload);

        // Comprueba que el status code sea 400 (Bad Request)
        expect(response.statusCode).toBe(400);
    });

})