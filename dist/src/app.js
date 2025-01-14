"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const dotenv = __importStar(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
//db connection
async function connectToDatabase() {
    const mongoUrl = DATABASE_URL;
    if (!mongoUrl) {
        throw new Error("Database URL is not defined in the environment variables.");
    }
    try {
        await mongoose_1.default.connect(mongoUrl);
        console.log("Database connected successfully!");
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Database connection error:", error.message);
        }
        else {
            console.error("Unknown error occurred during database connection:", error);
        }
    }
}
connectToDatabase();
//Routes
app.use('/books', bookRoutes_1.default);
app.listen(port, () => {
    console.log(`listening to port  ${port}`);
});
