import { createServer } from "http";
import { Server } from "socket.io";
var cors = require('cors')
import express from "express";

import { Twitch } from "./twitch"

import { uniqueQuestions } from "./db"

var corsOptions = {
    origin: 'http://localhost:3000'
}

const app = express();
app.use(cors(corsOptions))

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

const game = new Twitch();
game.connect();

io.on("connection", (socket) => {

    socket.on('gameStart', (d: number) => {
        console.log("gameStart")
        game.startGame(d);
    });

    socket.on('questionStart', (d: string) => {
        console.log("questionStart")
        game.startAnswerPoll(d);
    });

    socket.on('questionEnd', () => {
        console.log("questionEnd")
        game.endAnswerPoll();
    });

    socket.on('topUsers', (d: number, res: any) => {
        console.log("topUsers")
        res(game.topUsers(d))
    });

    socket.on('questions', async (d: number, res: any) => {
        const questions = await uniqueQuestions(d)
        console.log("questions")
        res(questions)
    });

    socket.on('chat', async (msg: string) => {
        console.log("chat", msg)
        game.sendMessage(msg)
    });

});

app.get('/', (req, res) => {
    res.send('wtf');
})

httpServer.listen(3000);
