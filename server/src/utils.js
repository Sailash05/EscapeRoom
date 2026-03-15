import jwt from 'jsonwebtoken';

export const generateJwtToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '180d',  // 6 months
    });
};

export const response = (condition, message, data) => {
    const res = {
        condition: condition.toUpperCase(),
        message: message,
        data: data
    }
    return res;
}