import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const app = express();
// Para que nuestro servidor express pueda interpretar en forma automática mensajes de tipo JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 8080;
// Configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  
  res.render("index");
})

const httpServer = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

let messages = [];

// Configuración de socket 

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado con el id ${socket.id}`);

    socket.on("newUser", (data) => {
      socket.userName = data;
      socket.broadcast.emit("newUser", data);
    });

    socket.on("message", (data) => {
      messages.push(data);
      io.emit("messageLogs", messages);
    });

    socket.on("disconnect", () => {
      if (socket.userName) {
        io.emit("user-disconnect", socket.userName);
        console.log(`${socket.userName} se desconectó`)
      }
    })
})

