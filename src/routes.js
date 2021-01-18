const express = require("express");
const multer = require("multer");
const SpreadSheetController = require("./controllers/SpreadSheetController");
const routes = new express.Router();
const multPart = multer();

routes.get("/api/sheet/list-all", SpreadSheetController.listAll);
routes.post("/api/sheet/insert", multPart.none(),SpreadSheetController.insert);
routes.put("/api/sheet/update/:id", multPart.none(), SpreadSheetController.update);

module.exports = routes;
