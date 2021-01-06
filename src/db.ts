
import * as admin from 'firebase-admin';
import axios from "axios"

var serviceAccount = require("./chat-asks-firebase-adminsdk-yqjbb-2951b490e7.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

export { firestore };

interface opentdbQuestion {
    category: string,
    type: "multiple" | "boolean",
    difficulty: "medium" | "easy" | "hard",
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
};


function randId() {
    return firestore.collection('questions').doc().id;
}

export async function uniqueQuestions(count: number) {

    let ids: any = {};
    let ret: any = [];

    while (true) {
        const q = await firestore.collection('questions').where(admin.firestore.FieldPath.documentId(), ">", randId()).limit(count).get();
        let parsed = q.docChanges().map(d => {
            return {
                ...d.doc.data(),
                id: d.doc.id,
            }
        });

        parsed.forEach(x => {
            if (!ids[x.id]) {
                ret.push(x)
            }
        });

        if (ret.length >= count)
            break;
    }

    return ret.slice(0, count);
}


function sleep(sec: number) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(0);
        }, sec * 1000);
    });
}

export async function work() {

    try {

        const token = await axios.get("https://opentdb.com/api_token.php?command=request").then(d => d.data.token)

        const url = `https://opentdb.com/api.php?amount=100&token=afc21b3316c734791171c5258e1014bbbc48281febd449db69282126a9ad04e2`

        while (true) {

            const questions = await axios.get(url).then(d => d.data.results as opentdbQuestion[])
            if (questions.length == 0) break;

            const b = firestore.batch();
            questions.forEach(q => {
                b.set(firestore.collection('questions').doc(), q)
            })
            await b.commit();

            console.log(`wrote ${questions.length}`);
            await sleep(1);
        }
    }
    catch (e) {
        console.error(e)
    }
}
