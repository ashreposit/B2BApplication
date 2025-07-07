import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API documentation for B2B application",
      version: "1.0.0",
      description: "API documentation using Swagger and TypeScript",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/docs/*.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);
