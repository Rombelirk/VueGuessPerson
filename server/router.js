import express from 'express';
import isAuthenticated from "./middleware/isAuthenticated";
import path from "path";
import * as Controller from "./controller"

const router = express.Router();

// restricted area
router.post("/signup", Controller.signUp);
router.post("/login", Controller.signIn);
router.get("/logout", Controller.logout);
router.post("/upload", Controller.upload);

// TODO change to all paths
//  or maybe static to nginx
router.get("/", (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));
router.get("/login", (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));

// restricted area
router.use(isAuthenticated);
router.get("/init", Controller.init);
router.get("/upload", (req, res) => res.sendFile(path.resolve(__dirname, '../dist/index.html')));


export default router;
