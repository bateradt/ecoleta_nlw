import express from "express";
import path from "path";
import cors from 'cors';
import routes from "./routes";
import {errors} from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(3332);

// const users = [
//     'Marcelo',
//     'Katia',
//     'José',
//     'Leandra'
// ];

// app.get('/users', (req, res) => {
//     console.log('Lista usuarios');
//     const search = String(req.query.search);
//     console.log(search);

//     const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

//     return res.json(filteredUsers);
// });

// app.post('/users', (req, res) => {
//     const user = {
//         name: "Marcelo",
//         email: "marcelofscarpim@gmail.com"
//     };
//     return res.json(user);
// });

// app.get('/users/:id', (req, res) => {
//     const id = Number(req.params.id);
//     const user = users[id];
//     return res.json(user);
// });
