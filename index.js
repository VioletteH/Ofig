import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import router from './app/router.js';

const PORT = process.env.PORT || 3000;
const app = express();


app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET, // NEW
  cookie: {
    secure: false,
    maxAge: (365 * 24 * 1000 * 60 * 60) // ça fait un an
  }
}));

app.set("view engine", "ejs");
app.set("views", "app/views");

app.use(express.static('public'));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
