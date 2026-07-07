"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = Test;
var uploadthing_1 = require("./src/lib/uploadthing");
var react_1 = __importDefault(require("react"));
function Test() {
    return <uploadthing_1.UploadDropzone endpoint="imageUploader" config={{ mode: "auto" }}/>;
}
