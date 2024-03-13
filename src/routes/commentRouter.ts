import express from "express";
import CommentController from "../controllers/commentController";

const routerComment = express();

routerComment.post("/create", CommentController.createComment);
routerComment.delete("/delete/:id", CommentController.deleteComments);

export default routerComment;
