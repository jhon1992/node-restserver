// ==============================
// Port
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// Vencimiento de Token
// 60 sec, 60 MIN , 24 hours, 30 days
// ==============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==============================
// SEED de autenticación
// ==============================

process.env.SEED = process.env.SEED || 'secret-dev';

// ==============================
// Google Client ID
// ==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '219758474264-vh1bibcphgvbc32km508lubtqkanikf1.apps.googleusercontent.com';

// ==============================
// Base De Datos
// ==============================
let urlDataBase;

if (process.env.NODE_ENV === 'dev') {
    urlDataBase = 'mongodb://localhost:27018/cafe';
} else {
    urlDataBase = process.env.MONGO_URI;
}

process.env.URLDB = urlDataBase;