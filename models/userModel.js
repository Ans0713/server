import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    role:{
        type: String,
        default: 'user',
    },
    password: {
        type: String,
        required: true,
    }
});

const User = model('User', userSchema);
export default  User;
