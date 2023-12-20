const express = require('express');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

//get port from environment
const port = process.env.PORT || 3000;

//declare users 
let users = [];

//function to check is valud uuid 
function isValidUUID(uuid) {
    return uuidValidate(uuid);
}
  

app.use(express.json());
//get all users
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/',(req,res)=>{
    console.log(`process id is--${process.pid}`)
})

//get user details by id
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isValidUUID(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

//save user data 
app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;

  console.log(hobbies);

  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required fields' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  // push user data into the in memory json object
  users.push(newUser);

  res.status(201).json(newUser);
});

//update user data
app.put('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isValidUUID(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required fields' });
  }

  users[userIndex] = {
    id: userId,
    username,
    age,
    hobbies: hobbies || [],
  };

  res.status(200).json(users[userIndex]);
});

//delete user 
app.delete('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!isValidUUID(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  return res.status(204).json({ message: 'User deleted' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




module.exports = app;
