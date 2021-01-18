const cors = require("cors");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const PORT = 31250;

app.use(cors());
app.use(require("./routes"));

server.listen(PORT);
console.log(`Server is running on port ${PORT}`);
