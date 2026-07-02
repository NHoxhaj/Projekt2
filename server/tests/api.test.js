process.env.FIRST_SECRET_KEY = 'test-secret-key';
process.env.CLIENT_ORIGINS = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/foodItem.model', () => ({
  find: jest.fn(),
}));

const FoodItem = require('../models/foodItem.model');
const app = require('../app');

describe('API smoke tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/csrf-token returns a CSRF token and cookie', async () => {
    const response = await request(app).get('/api/csrf-token').expect(200);

    expect(response.body.csrfToken).toContain('.');
    expect(response.headers['set-cookie'].some((cookie) => cookie.startsWith('csrfToken='))).toBe(true);
  });

  test('GET /api/foodItems returns food items', async () => {
    const foodItems = [
      {
        _id: 'food-1',
        name: 'Pizza',
        description: 'Cheese pizza',
        price: 8,
        quantity: 1,
        image: 'assets/food_1.png',
        category: 'Pizza',
      },
    ];
    FoodItem.find.mockResolvedValue(foodItems);

    const response = await request(app).get('/api/foodItems').expect(200);

    expect(response.body).toEqual(foodItems);
    expect(FoodItem.find).toHaveBeenCalledTimes(1);
  });

  test('GET /api/orders rejects unauthenticated users', async () => {
    const response = await request(app).get('/api/orders').expect(401);

    expect(response.body).toMatchObject({
      verified: false,
      message: 'No token provided',
    });
  });

  test('GET /api/admin/orders rejects unauthenticated admins', async () => {
    const response = await request(app).get('/api/admin/orders').expect(401);

    expect(response.body).toMatchObject({
      verified: false,
      message: 'No token provided',
    });
  });

  test('POST /api/login rejects requests without a CSRF token', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(403);

    expect(response.body).toEqual({ message: 'Invalid CSRF token' });
  });

  test('GET /api/checkAuth rejects invalid user tokens', async () => {
    const invalidToken = jwt.sign({ id: 'user-1' }, 'wrong-secret');

    const response = await request(app)
      .get('/api/checkAuth')
      .set('Cookie', [`usertoken=${invalidToken}`])
      .expect(401);

    expect(response.body).toMatchObject({
      verified: false,
      message: 'Invalid token',
    });
  });
});
