import mongoose from 'mongoose';

const connectToDb = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error) {
        throw new Error('error connecting to db');
    }
};

export default connectToDb;
