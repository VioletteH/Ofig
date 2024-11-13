import 'dotenv/config';
import express from 'express';
import router from './app/router.js';

const PORT = process.env.PORT || 3000;
const app = express();

import session from 'express-session';
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "Guess it!",
  cookie: {
    secure: false,
  }
}));

app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(express.static('public'));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
