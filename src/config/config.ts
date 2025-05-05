export default () => ({
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
  database: {
    port: process.env.DATABASE_PORT || 5432,
    password: process.env.DATABASE_PASSWORD,
    DB: process.env.DATABASE_NAME,
  },
  elastic: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
  },
});
