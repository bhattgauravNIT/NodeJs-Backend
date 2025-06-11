import UserModel from '../model/UserModel.js'

const User = UserModel.User;

async function getAllUsers() {
    try {
        return await User.find({});
    } catch (err) {
        throw new Error(err);
    }
};

async function addUser(userData) {
    try {
        return await User.create(userData);
    } catch (err) {
        throw new Error(err);
    }
};

async function getUserById(id) {
    try {
        return await User.findById(id);
    } catch (err) {
        throw new Error(err);
    }
};

async function updateUser(id, user) {
    try {
        return await User.findByIdAndUpdate(id, user);
    } catch (err) {
        throw new Error(err);
    }
};

async function deleteUser(id) {
    try {
        return await User.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(err);
    }
};

export default {
    getAllUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
}