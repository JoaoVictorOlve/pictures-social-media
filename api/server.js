const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
console.log('Começou!');
const path = require('path')
require('dotenv').config();

// arquivo de imagens estáticas

app.use('/src/Images', express.static(path.join(__dirname, './src/Images')));

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// forma de ler JSON

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

// rotas da API

const postRoutes = require('./src/routes/post.route.js');
const userRoutes = require('./src/routes/user.route.js');

app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);

// db.js

(async () => {
  const database = require('./src/database/config/db.js');
  await database.sync();
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});