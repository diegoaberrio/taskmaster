require('dotenv').config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];

requiredEnvVars.forEach((varName) => {
    if (process.env[varName] === undefined) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE
    }
};
