import { uniqueQuestions } from "./db"

(async () => {
    let x = await uniqueQuestions(20);
    console.log(x);
})();
