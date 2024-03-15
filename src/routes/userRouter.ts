import express from "express";
import UserController from "../controllers/userController";

const routerUser = express();

routerUser.post("/register", UserController.createUser);
routerUser.post("/login", UserController.loginUser);
routerUser.post("/token", UserController.refreshAccessToken);
routerUser.post("/logout", UserController.logout);

export default routerUser;
