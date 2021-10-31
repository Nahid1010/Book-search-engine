const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true },
        );

        return updatedUser;

      }
      throw new AuthenticationError('Please log in!');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          {_id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true },
        );

        return updatedUser;

      }
      throw new AuthenticationError('Unable to delete book!');
    }
  },
};

module.exports = resolvers;