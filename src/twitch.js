"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twitch = void 0;
var tmi = require('tmi.js');
Array.prototype.firstN = function (n) {
    return (this.length ? this.slice(0, Math.min(n, this.length)) : []);
};
var Modes;
(function (Modes) {
    Modes[Modes["POLL_ANSWERS"] = 0] = "POLL_ANSWERS";
    Modes[Modes["IDLE"] = 1] = "IDLE";
})(Modes || (Modes = {}));
var Twitch = /** @class */ (function () {
    function Twitch() {
        // state: State = {};
        this.scores = {};
    }
    Twitch.prototype.connect = function () {
        var _this = this;
        var opts = {
            identity: {
                username: "chatasks",
                password: "oauth:ja6x022juc1eq8g2ss71hxwlr7bfcx"
            },
            channels: [
                "chatasks"
            ]
        };
        var client = new tmi.client(opts);
        client.on('message', function (target, context, msg, self) { return _this.onMessageHandler(target, context, msg, self); });
        client.on('connected', function () { return console.log('connected'); });
        client.connect();
        this.client = client;
    };
    Twitch.prototype.startGame = function (answerMaxTime) {
        this.scores = {};
        this.answerMaxTime = answerMaxTime;
    };
    Twitch.prototype.startAnswerPoll = function (letter) {
        console.log('correct answer', letter);
        this.mode = Modes.POLL_ANSWERS;
        this.correctAnswer = letter.toLowerCase();
        this.questionStartTime = Date.now();
    };
    Twitch.prototype.endAnswerPoll = function () {
        this.mode = Modes.IDLE;
    };
    Twitch.prototype.setScore = function (user) {
        var score = 100 * (this.answerMaxTime - (((Date.now() - this.questionStartTime) / 1000) - 5)) / this.answerMaxTime; // stream delay - 5
        this.scores[user] = (this.scores[user] || 0) + Math.max(score, 0);
    };
    Twitch.prototype.topUsers = function (count) {
        var _this = this;
        var users = Object.keys(this.scores);
        var topN = users.sort(function (a, b) { return _this.scores[b] - _this.scores[a]; }).firstN(count);
        return topN.map(function (username) {
            return {
                username: username,
                score: _this.scores[username].toFixed(2)
            };
        });
    };
    Twitch.prototype.sendMessage = function (msg) {
        this.client.say("#chatasks", msg);
    };
    Twitch.prototype.onMessageHandler = function (target, context, msg, self) {
        // if (self) return;
        switch (this.mode) {
            case Modes.POLL_ANSWERS: {
                if (msg.toLowerCase() === this.correctAnswer) {
                    this.setScore(context.username);
                }
            }
        }
    };
    return Twitch;
}());
exports.Twitch = Twitch;
// // Called every time the bot connects to Twitch chat
// function onConnectedHandler(addr, port) {
//     console.log(`* Connected to ${addr}:${port}`);
//     setInterval(() => {
//         client.say(`#james689`, "yalan")
//     }, 1000)
// }
