"use strict";
// auth.test.js
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
describe('auth', () => {
    describe('hashPassword', () => {
        it('hashes the given password using SHA-256', () => {
            const password = 'password123';
            const hashed = (0, auth_1.hashPassword)(password);
            expect(hashed).toMatch(/^[a-f0-9]{64}$/); // hex string
            expect(hashed).not.toBe(password);
        });
    });
});
//# sourceMappingURL=auth.test.js.map