// ==============================
// Port
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ==============================
// Base De Datos
// ==============================
let urlDataBase;
//if (process.env.NODE_ENV === 'dev') {
//    urlDataBase = 'mongodb://localhost:27018/cafe';
//} else {
urlDataBase = 'mongodb+srv://jhon:J6IadXUA2VLV1wSY@cluster0-twiza.mongodb.net/cafe';
//}

process.env.URLDB = urlDataBase;