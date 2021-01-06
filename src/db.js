"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.work = exports.uniqueQuestions = exports.firestore = void 0;
var admin = __importStar(require("firebase-admin"));
var axios_1 = __importDefault(require("axios"));
var serviceAccount = require("./chat-asks-firebase-adminsdk-yqjbb-2951b490e7.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
var firestore = admin.firestore();
exports.firestore = firestore;
;
function randId() {
    return firestore.collection('questions').doc().id;
}
function uniqueQuestions(count) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, ret, q, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ids = {};
                    ret = [];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, firestore.collection('questions').where(admin.firestore.FieldPath.documentId(), ">", randId()).limit(count).get()];
                case 2:
                    q = _a.sent();
                    parsed = q.docChanges().map(function (d) {
                        return __assign(__assign({}, d.doc.data()), { id: d.doc.id });
                    });
                    parsed.forEach(function (x) {
                        if (!ids[x.id]) {
                            ret.push(x);
                        }
                    });
                    if (ret.length >= count)
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, ret.slice(0, count)];
            }
        });
    });
}
exports.uniqueQuestions = uniqueQuestions;
function sleep(sec) {
    return new Promise(function (res, rej) {
        setTimeout(function () {
            res(0);
        }, sec * 1000);
    });
}
function work() {
    return __awaiter(this, void 0, void 0, function () {
        var token, url, _loop_1, state_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.get("https://opentdb.com/api_token.php?command=request").then(function (d) { return d.data.token; })];
                case 1:
                    token = _a.sent();
                    url = "https://opentdb.com/api.php?amount=100&token=afc21b3316c734791171c5258e1014bbbc48281febd449db69282126a9ad04e2";
                    _loop_1 = function () {
                        var questions, b;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, axios_1.default.get(url).then(function (d) { return d.data.results; })];
                                case 1:
                                    questions = _a.sent();
                                    if (questions.length == 0)
                                        return [2 /*return*/, "break"];
                                    b = firestore.batch();
                                    questions.forEach(function (q) {
                                        b.set(firestore.collection('questions').doc(), q);
                                    });
                                    return [4 /*yield*/, b.commit()];
                                case 2:
                                    _a.sent();
                                    console.log("wrote " + questions.length);
                                    return [4 /*yield*/, sleep(1)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    return [3 /*break*/, 2];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.work = work;
