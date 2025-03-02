import express from 'express';

const UserRoutes = express.Router();

// Example route for getting all users
UserRoutes.get('/users', (req, res) => {
    res.send('Get all users');
});

// Example route for getting a single user by ID
UserRoutes.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Get user with ID: ${userId}`);
});

// Example route for creating a new user
UserRoutes.post('/users', (req, res) => {
    const newUser = req.body;
    res.send(`Create a new user with data: ${JSON.stringify(newUser)}`);
});

// Example route for updating a user by ID
UserRoutes.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.send(`Update user with ID: ${userId} with data: ${JSON.stringify(updatedUser)}`);
});

// Example route for deleting a user by ID
UserRoutes.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Delete user with ID: ${userId}`);
});

export default UserRoutes;