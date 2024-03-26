import express from "express";
import CommentController from "../controllers/commentController";

const routerComment = express();

routerComment.post("", CommentController.createComment);
routerComment.delete("/:id", CommentController.deleteComments);

export default routerComment;
