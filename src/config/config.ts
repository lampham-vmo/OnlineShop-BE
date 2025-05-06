export default () => ({
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
  database: {
    port: process.env.DATABASE_PORT || 5432,
    password: process.env.DATABASE_PASSWORD,
    DB: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
  },
  elastic: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    user: process.env.ELASTIC_USER,
    password: process.env.ELASTIC_PASSWORD,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    user: process.env.REDIS_USER,
  },
});
