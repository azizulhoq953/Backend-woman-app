import express from 'express';

const AdminRoutes = express.Router();

// Example route for getting admin dashboard
AdminRoutes.get('/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});

// Example route for managing users
AdminRoutes.get('/users', (req, res) => {
    res.send('Manage Users');
});

// Example route for managing settings
AdminRoutes.get('/settings', (req, res) => {
    res.send('Admin Settings');
});

export default AdminRoutes;