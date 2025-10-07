// Services/src/modules/userManagement/services/userService.ts

import User from '../models/user';

export const getAllUsers = async (filter: any = {}) => {
  return await User.find(filter).select('-password').sort({ joinedAt: -1 });
};

export const getUserById = async (id: string) => {
  return await User.findById(id).select('-password');
};

export const createUser = async (userData: any) => {
  const user = new User(userData);
  return await user.save();
};

export const updateUser = async (id: string, userData: any) => {
  return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const searchUsers = async (query: string) => {
  const regex = new RegExp(query, 'i');
  return await User.find({
    $or: [
      { name: regex },
      { email: regex }
    ]
  }).select('-password');
};