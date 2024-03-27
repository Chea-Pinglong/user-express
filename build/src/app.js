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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./config/database");
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("../public/swagger.json"));
const redoc_express_1 = __importDefault(require("redoc-express"));
/**
 * Initializes Express app and connects to MongoDB database.
 * Exports app and db instances.
 */
mongoose_1.default.connect(database_1.MONGODB_URI);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
// Routes
app.use(userRoutes_1.default);
app.get("/docs", (0, redoc_express_1.default)({
    title: "API Docs",
    specUrl: "/swagger.json",
    redocOptions: {
        theme: {
            colors: {
                primary: {
                    main: "#1234F6",
                },
            },
            typography: {
                fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
                fontSize: "15px",
                lineHeight: "1.5",
                code: {
                    code: "#FF11CC",
                    backgroundColor: "#AABBCC",
                },
            },
            menu: {
                backgroundColor: "#ffffff",
            }
        }
    }
}));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
database_1.db.once("open", () => {
    console.log(`MongoDB connected to ${database_1.MONGODB_URI}`);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map