import crypto from 'node:crypto';
import pg from 'pg';

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

await client.connect();
const userId = crypto.randomUUID();
const cartId = crypto.randomUUID();
const products = [
  {
    product_id: crypto.randomUUID(),
    count: randomInteger(0, 100),
  },
  {
    product_id: crypto.randomUUID(),
    count: randomInteger(0, 100),
  },
  {
    product_id: crypto.randomUUID(),
    count: randomInteger(0, 100),
  },
];

await client.query({
  text: `INSERT INTO carts(id, user_id, created_at, updated_at) VALUES($1, $2, $3, $4)`,
  values: [cartId, userId, new Date().toISOString(), new Date().toISOString()],
});

await Promise.all(
  products.map(({ product_id, count }) => {
    return client.query({
      text: `INSERT INTO cart_items(cart_id, product_id, count) VALUES($1, $2, $3)`,
      values: [cartId, product_id, count],
    });
  }),
);

await client.end();

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
