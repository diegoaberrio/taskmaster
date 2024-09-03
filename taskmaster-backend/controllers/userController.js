const { body, param, validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
    console.log('Invoking getAllUsers in userController');
    User.getAllUsers()
        .then(users => res.json(users))
        .catch(err => {
            console.error('Error getting all users:', err);
            res.status(500).send(err);
        });
};

// Obtener un usuario por ID
exports.getUserById = [
    param('id').isInt().withMessage('User ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        console.log(`Invoking getUserById in userController with ID: ${userId}`);
        User.getUserById(userId)
            .then(user => {
                if (!user) {
                    console.log('User not found');
                    return res.status(404).send('User not found');
                }
                res.json(user);
            })
            .catch(err => {
                console.error('Error getting user by ID:', err);
                res.status(500).send(err);
            });
    }
];

// Crear un nuevo usuario
exports.createUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('Request Body:', req.body);

        const { email, name, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            name,
            password: hashedPassword,
        };

        console.log('Creating user with data:', newUser);
        User.createUser(newUser)
            .then(result => {
                console.log('User created with ID:', result.insertId);
                res.status(201).json({ id: result.insertId, ...newUser });
            })
            .catch(err => {
                console.error('Error creating user:', err);
                res.status(500).send(err);
            });
    }
];

// Actualizar un usuario por ID
exports.updateUser = [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        const userData = req.body;

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        console.log(`Updating user with ID: ${userId} and data:`, userData);
        User.updateUser(userId, userData)
            .then(() => {
                console.log('User updated with ID:', userId);
                res.status(200).json({ id: userId, ...userData });
            })
            .catch(err => {
                console.error('Error updating user:', err);
                res.status(500).send(err);
            });
    }
];

// Eliminar un usuario por ID
exports.deleteUser = [
    param('id').isInt().withMessage('User ID must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        console.log(`Deleting user with ID: ${userId}`);
        User.deleteUser(userId)
            .then(() => {
                console.log('User deleted with ID:', userId);
                res.status(204).send();
            })
            .catch(err => {
                console.error('Error deleting user:', err);
                res.status(500).send(err);
            });
    }
];

// Actualizar puntos de un usuario por ID
exports.updateUserPoints = [
    param('id').isInt().withMessage('User ID must be an integer'),
    body('points').isInt().withMessage('Points must be an integer'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        const points = req.body.points;
        console.log(`Updating points for user with ID: ${userId} and points: ${points}`);
        User.updateUserPoints(userId, points)
            .then(result => {
                console.log('User points updated for ID:', userId);
                res.status(200).json(result);
            })
            .catch(err => {
                console.error('Error updating user points:', err);
                res.status(500).send(err);
            });
    }
];

// Obtener el total de usuarios
exports.getTotalUsers = (req, res) => {
    console.log('Invoking getTotalUsers in userController');
    User.getTotalUsers()
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error getting total users:', err);
            res.status(500).send(err);
        });
};

// Obtener usuarios por puntos
exports.getUsersByPoints = (req, res) => {
    console.log('Invoking getUsersByPoints in userController');
    User.getUsersByPoints()
        .then(users => res.json(users))
        .catch(err => {
            console.error('Error getting users by points:', err);
            res.status(500).send(err);
        });
};

// Login de usuario
exports.login = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation Errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        console.log(`Invoking login in userController with email: ${email}`);
        User.getUserByEmail(email)
            .then(user => {
                if (!user) {
                    console.log('Invalid email or password');
                    return res.status(400).json({ message: 'Invalid email or password' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return res.status(500).send(err);
                    }
                    if (!isMatch) {
                        console.log('Invalid email or password');
                        return res.status(400).json({ message: 'Invalid email or password' });
                    }

                    const token = jwt.sign({ id: user.id, name: user.name }, 'secret_key', { expiresIn: '1h' });

                    console.log('Login successful, token generated:', token);
                    res.json({ token, id: user.id, name: user.name }); // Incluir el ID y el nombre del usuario en la respuesta
                });
            })
            .catch(err => {
                console.error('Error during login:', err);
                res.status(500).send(err);
            });
    }
];
