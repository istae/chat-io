const tmi = require('tmi.js');

declare global {
    interface Array<T> {
        firstN(n: number): T[];
    }
}

Array.prototype.firstN = function (n: number) {
    return (this.length ? this.slice(0, Math.min(n, this.length)) : []);
}

enum Modes {
    POLL_ANSWERS,
    IDLE
}

interface State {
    correctAnswer?: string;
    answerMaxTime?: number;
}

interface UserAnswer {
    answer: string;
    timer: number;
}

interface UserScores {
    [ket: string]: number;
}

export class Twitch {
    correct_answer: string;

    // state: State = {};
    scores: UserScores = {};

    questionStartTime: number;
    mode: Modes;
    correctAnswer: string;
    answerMaxTime: number;

    client: any;

    connect() {
        const opts = {
            identity: {
                username: "chatasks",
                password: "oauth:ja6x022juc1eq8g2ss71hxwlr7bfcx"
            },
            channels: [
                "chatasks"
            ]
        };
        const client = new tmi.client(opts);
        client.on('message', (target: any, context: any, msg: any, self: any) => this.onMessageHandler(target, context, msg, self));
        client.on('connected', () => console.log('connected'));
        client.connect();
        this.client = client;
    }

    startGame(answerMaxTime: number) {
        this.scores = {};
        this.answerMaxTime = answerMaxTime;
    }

    startAnswerPoll(letter: string) {
        console.log('correct answer', letter)
        this.mode = Modes.POLL_ANSWERS;
        this.correctAnswer = letter.toLowerCase();
        this.questionStartTime = Date.now();
    }

    endAnswerPoll() {
        this.mode = Modes.IDLE;
    }

    setScore(user: string) {

        const score = 100 * (this.answerMaxTime - (((Date.now() - this.questionStartTime) / 1000) - 5)) / this.answerMaxTime; // stream delay - 5
        this.scores[user] = (this.scores[user] || 0) + Math.max(score, 0);
    }

    topUsers(count: number) {
        const users = Object.keys(this.scores)
        const topN = users.sort((a, b) => this.scores[b] - this.scores[a]).firstN(count);
        return topN.map(username => {
            return {
                username,
                score: this.scores[username].toFixed(2)
            }
        });
    }


    sendMessage(msg: string) {
        this.client.say("#chatasks", msg);
    }

    onMessageHandler(target: any, context: any, msg: string, self: any) {
        // if (self) return;
        switch (this.mode) {
            case Modes.POLL_ANSWERS: {
                if (msg.toLowerCase() === this.correctAnswer) {
                    this.setScore(context.username)
                }
            }
        }
    }
}

// // Called every time the bot connects to Twitch chat
// function onConnectedHandler(addr, port) {
//     console.log(`* Connected to ${addr}:${port}`);

//     setInterval(() => {
//         client.say(`#james689`, "yalan")
//     }, 1000)
// }