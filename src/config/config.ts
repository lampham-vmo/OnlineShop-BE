export default () => ({
  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
  database: {
    port: process.env.POSTGRES_PORT || 5432,
    password: process.env.POSTGRES_PW,
    DB: process.env.POSTGRES_DB,
  },
  elastic: {
    node: process.env.ELASTICSEARCH_NODE,
  }
});
