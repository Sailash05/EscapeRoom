import mongoose from 'mongoose';
import User from './userModel.js';

import { response, generateJwtToken } from './utils.js';


export const loginUser = async (req, res) => {
    const { registerNo } = req.body;
    if (!registerNo || registerNo.length !== 12) {
        return res.status(400).send(response("FAILED", "Wrong register number", null));
    }
    try {
        const user = await User.findOne({ registerNo });
        if (!user) {
            return res.status(404).send(response("FAILED", "User not found", null));
        }
        const token = generateJwtToken({
            userId: user._id,
            registerNo: user.registerNo
        });
        return res.status(200).send(
            response("SUCCESS", "User found", {
                userName: user.userName,
                registerNo: user.registerNo,
                token: token
            })
        );
    } 
    catch (err) {
        return res.status(500).send(response("FAILED", err.message, null));
    }
};


export const solvedQuestion = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send(response("FAILED", "User not found", null));
        }

        return res.status(200).send(
            response("SUCCESS", "Solved questions retrieved", { userDetails: user })
        );
    } 
    catch (err) {
        return res.status(500).send(response("FAILED", err.message, null));
    }
};

export const submitAnswer = async (req, res) => {

    const answers = ['4', '404', 'linux', 'gui', 'brain', 'yizrm', 'miz', 'desc', 'reverse engineer', 'thank you'];

    try {

        const { questionNo, answer } = req.body;

        if (!questionNo || !answer) {
            return res.status(400).send(response("FAILED", "Invalid request", null));
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).send(response("FAILED", "User not found", null));
        }

        const solved = user.questionsSolved;

        // Prevent skipping questions
        if (solved !== questionNo - 1) {
            return res.status(400).send(response("FAILED", "Solve previous question first", null));
        }

        const correctAnswer = answers[questionNo - 1];

        if (!correctAnswer) {
            return res.status(400).send(response("FAILED", "Invalid question number", null));
        }

        if (correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase()) {

            user.questionsSolved = solved + 1;
            await user.save();

            return res.status(200).send(
                response("SUCCESS", "Correct Answer", {
                    nextQuestion: solved + 2
                })
            );
        } 
        else {
            return res.status(200).send(response("FAILED", "Wrong answer", null));
        }

    } 
    catch (err) {
        return res.status(500).send(response("FAILED", err.message, null));
    }
};