import express from 'express';
const router = express.Router();
// Example route for getting admin dashboard
router.get('/dashboard', (req, res) => {
    res.send('Admin Dashboard');
});
// Example route for managing users
router.get('/users', (req, res) => {
    res.send('Manage Users');
});
// Example route for managing settings
router.get('/settings', (req, res) => {
    res.send('Admin Settings');
});
export default router;
