import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const swaggerServer = process.env.SWAGGER_SERVER ?? "http://localhost:7000/api";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.2",
    info: {
      title: "Portfolio API Documentation",
      version: "1.0.0",
      description: "MyBrand - Backend API",
    },
    servers: [{ url: swaggerServer }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/doc/*.ts", "./src/doc/*.yml"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
