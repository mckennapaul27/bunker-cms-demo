import mongoose from 'mongoose';

mongoose.set('debug', true);

const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false }, // in case of social login
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
