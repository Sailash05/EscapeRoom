import express from 'express';
import { loginUser, solvedQuestion, submitAnswer } from './apiController.js';
import { verifyToken } from './apiMiddleware.js';

const router = express.Router();


router.post('/login', loginUser);
router.get('/solved', verifyToken, solvedQuestion);
router.post('/submit-ans', verifyToken, submitAnswer);


export default router;