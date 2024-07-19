const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const sequelize = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

sequelize.sync();

//signup user
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//login user

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    const is_password_matched = await bcrypt.compare(password, user.password);

    if (user && is_password_matched) {
      const token = jwt.sign({ id: user.id }, 'secretKey');
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/logout', (req, res) => {
  res.send('Logged out');
});

app.listen(3000, () => {
  console.log('Auth service running on port 3000');
});
