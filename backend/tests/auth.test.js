require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const test = require('node:test');
const assert = require('node:assert');
const { generateToken, verifyToken } = require('../utils/jwt');
const { sanitizeInput } = require('../middlewares/sanitize');

// Fallback JWT secret for testing environment if not loaded from .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test_fallback_secret_key_123';
}

test('JWT Utility functions', async (t) => {
  await t.test('should sign and verify tokens correctly', () => {
    const token = generateToken('user123');
    assert.ok(token);
    
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, 'user123');
  });
});

test('Sanitization Middleware', async (t) => {
  await t.test('should strip NoSQL operators and HTML tags', () => {
    const req = {
      body: {
        email: 'test@example.com',
        username: { $gt: '' },
        bio: '<h1>Hello</h1><p>World</p>'
      }
    };
    const res = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    sanitizeInput(req, res, next);
    
    assert.ok(nextCalled);
    assert.strictEqual(req.body.email, 'test@example.com');
    assert.deepStrictEqual(req.body.username, {});
    assert.strictEqual(req.body.bio, 'HelloWorld');
  });
});
