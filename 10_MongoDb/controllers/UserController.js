import express from 'express';
import userService from '../service/UserService.js'

const router = express.Router();

router.route('/user')
    .get(async (_req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            console.error("Error in GET /user:", err);
            res.status(500).json({ error: err.message || err.toString() });
        }
    })
    .post(async (req, res) => {
        try {
            const newUser = await userService.addUser(req.body);
            res.status(201).json(newUser);
        } catch {
            res.status(500).json({ err });
        }
    });

router.route('/user/:userId')
    .get(async (req, res) => {
        try {
            const user = await userService.getUserById(req.params.userId);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ err });
        }
    })
    .put(async (req, res) => {
        try {
            const user = await userService.updateUser(req.params.userId, req.body);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ err });
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await userService.deleteUser(req.params.userId);
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ err });
        }
    });

export default router;