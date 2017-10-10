"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class DatabaseConfig {
    constructor(uriDb) {
        mongoose.connect(uriDb, { useMongoClient: true });
    }
}
exports.DatabaseConfig = DatabaseConfig;
