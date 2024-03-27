"use strict";
// userController.test.ts 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const user_1 = __importDefault(require("../../models/user"));
let mongoServer;
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    yield mongoose_1.default.connect(mongoServer.getUri());
    server = app_1.default.listen();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
    server.close();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.deleteMany({});
}));
describe('User Controller', () => {
    describe('POST /', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: 'John Doe',
                email: 'john@test.com',
                password: 'password123'
            };
            const res = yield (0, supertest_1.default)(server)
                .post('/')
                .send(data)
                .expect(201)
                .catch(err => {
                throw err;
            });
            const users = yield user_1.default.find();
            expect(users).toHaveLength(1);
            expect(users[0].name).toBe('John Doe');
        }));
    });
    // Other tests...
});
//# sourceMappingURL=userController.test.js.map