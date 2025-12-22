const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// /!\ 必須繫結 db 到 app，json-server-auth 才能運作
app.db = router.db;

app.use(middlewares);
app.use(auth);
app.use(router);

app.listen(3000, () => {
    console.log('JSON Server Auth is running on http://localhost:3000');
});
