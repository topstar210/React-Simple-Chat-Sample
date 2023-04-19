import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import cors from "cors";

import WebSockets from "./WebSockets.js";

const app = express();
const PORT = 2087;

const corsObj = {
	origin: '*',
	methods: ['GET', 'POST', "DELETE", "PUT"],
	credentials: true
  }
app.use(cors(corsObj));
app.set("port", PORT);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
	return res.status(404).json({
	  success: false,
	  message: 'API endpoint doesnt exist'
	})
});


const server = http.createServer(app);
global.io =  new Server(server, {
    cors: corsObj
  });
global.io.on('connection', WebSockets.connection)
  
/** Listen on provided port, on all network interfaces. */
server.listen(PORT);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${PORT}`)
});