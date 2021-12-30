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
var cors_1 = __importDefault(require("cors"));
var cors = (0, cors_1.default)({
    methods: ['GET', 'HEAD'],
});
var runMiddleware = function (req, res, fn) {
    return new Promise(function (resolve, reject) {
        fn(req, res, function (result) {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};
var deploymentBadgeHandler = function (req, res, options) { return __awaiter(void 0, void 0, void 0, function () {
    var env, statusesUrl, state, color;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: 
            // Run the middleware
            return [4 /*yield*/, runMiddleware(req, res, cors)];
            case 1:
                // Run the middleware
                _b.sent();
                env = (_a = options.env) !== null && _a !== void 0 ? _a : 'Production';
                return [4 /*yield*/, new Promise(function (resolve) {
                        fetch(options.deploymentsUrl, __assign(__assign({}, options), { headers: {
                                'Authorization': 'Basic ' + btoa("".concat(process.env.GITHUB_USER, ":").concat(process.env.GITHUB_PAT))
                            } }))
                            .then(function (response) { return response.json(); })
                            .then(function (data) {
                            var matchingData = data.find(function (d) { return d['environment'] === env; });
                            resolve(matchingData['statuses_url']);
                        });
                    })];
            case 2:
                statusesUrl = _b.sent();
                console.log(statusesUrl);
                return [4 /*yield*/, new Promise(function (resolve) {
                        fetch(statusesUrl, __assign(__assign({}, options), { headers: {
                                'Authorization': 'Basic ' + btoa("".concat(process.env.GITHUB_USER, ":").concat(process.env.GITHUB_PAT))
                            } }))
                            .then(function (response) { return response.json(); })
                            .then(function (data) { return resolve(data[0]['state']); });
                    })];
            case 3:
                state = _b.sent();
                console.log(state);
                color = 'green';
                if (state === 'pending' || state === 'queued' || state === 'in_progress') {
                    color = 'yellow';
                }
                else if (state === 'failure' || state === 'error') {
                    color = 'red';
                }
                res.json({ schemaVersion: 1, label: 'deployment', message: state, color: color, namedLogo: options.namedLogo });
                return [2 /*return*/];
        }
    });
}); };
exports.default = deploymentBadgeHandler;
