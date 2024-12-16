"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("./App.css");
var react_datepicker_1 = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");
function App() {
    var _this = this;
    var _a = (0, react_1.useState)([]), files = _a[0], setFiles = _a[1];
    var _b = (0, react_1.useState)(new Date()), date = _b[0], setDate = _b[1];
    (0, react_1.useEffect)(function () {
        var fetchFiles = function () { return __awaiter(_this, void 0, void 0, function () {
            var year, month, day;
            return __generator(this, function (_a) {
                year = date.getFullYear();
                month = date.getMonth() + 1;
                day = date.getDate();
                getPageOfFiles(year, month, day).then(function (fileList) {
                    setFiles(fileList);
                });
                return [2 /*return*/];
            });
        }); };
        function getPageOfFiles(year, month, day) {
            return __awaiter(this, void 0, void 0, function () {
                var bucketUrl, response, text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            month = month.toString().padStart(2, '0');
                            day = day.toString().padStart(2, '0');
                            bucketUrl = "https://s3.ca-central-1.amazonaws.com/5040-hut-data.oram.ca/?prefix=webcam/".concat(year, "-").concat(month, "-").concat(day, "/");
                            return [4 /*yield*/, fetch(bucketUrl)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.text()];
                        case 2:
                            text = _a.sent();
                            return [2 /*return*/, parseFileList(text)];
                    }
                });
            });
        }
        function parseFileList(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, 'text/html'); // Or 'application/xml'
            var keys = Array.from(doc.querySelectorAll('Contents Key')).map(function (node) { return node.textContent; });
            var stringKeys = [];
            keys.forEach(function (key) {
                if (key !== null) {
                    stringKeys.push(key);
                }
            });
            return stringKeys ? stringKeys : [];
        }
        fetchFiles();
    }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Files in S3 Bucket"),
        react_1.default.createElement(react_datepicker_1.default, { selected: date, onChange: function (date) {
                if (date === null) {
                    return;
                }
                setDate(date);
            } }),
        react_1.default.createElement("ul", null, files.map(function (file, index) { return (react_1.default.createElement("li", { key: index }, file)); }))));
}
exports.default = App;
