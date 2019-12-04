const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");

const usersBuffer = fs.readFileSync("./data.json");
const users = JSON.parse(usersBuffer);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.put("/user", (req, res) => {
  const { username, password, email, age } = req.body;

  const user = {
    id: users.length + 1,
    username,
    password,
    email,
    age
  };

  users.push(user);

  fs.writeFileSync("./data.json", JSON.stringify(users, null, 4));

  res.status(200).json({ message: "guardado correctamente" });
});

app.post("/user", (req, res) => {
  const { id, username, password, age } = req.body;

  const newUsers = users.map(user => {
    if (user.id === id) {
      user.username = username ? username : user.username;
      user.password = password ? password : user.password;
      user.age = age ? age : user.age;
    }
    return user;
  });
console.log(newUsers)
  const stringifyUsers = JSON.stringify(newUsers, null, 4);

  fs.writeFileSync("./data.json", stringifyUsers);
  res.status(200).json({ message: "Actualizado correctamente" });
});

app.delete("/user", (req, res) => {
  const { id } = req.body;

  users[id - 1] = null;

  const stringifyUsers = JSON.stringify(users, null, 4);
  fs.writeFileSync("./data.json", stringifyUsers);

  res.status(200).json({ message: "Borrado correctamente" });
});

app.use((req, res) => {
  res.status(500).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`serves listen on port ${PORT}`);
});
