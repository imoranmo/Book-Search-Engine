// import user model
const { User } = require('../models');
// import sign token function from auth
const { AuthenticationError } = require("apollo-server-errors");
const { signToken } = require('../utils/auth');
const { sign } = require('jsonwebtoken');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user){

                const userData = await User.findOne({_id: context.user._id});
                return userData;
            };
            throw new AuthenticationError("Please log in!");
          },
    },
    Mutation: {
        login: async ( parent, {email, password}) => {
            const user =  await User.findOne ({
                email});
            if (!user) {
                throw new AuthenticationError("Cannot find email in system");
            }
            
            const userPW = await user.isCorrectPassword(password);
            if (!userPW) {
                throw new AuthenticationError("Invalid Password");
            }

            const token = signToken(user);
            return { token, user};
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { Token, user};
        },
        saveBook: async ( parent , args, contect) => {
            if(context.user) {

                return User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args } },
                    { new: true, runValidators: true  }
                  );
            }
            throw new AuthenticationError('Please login in first!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId}}},
                    { new: true}
                );
            }
            throw new AuthenticationError('Please login in first!')
        },
        
    },
};

module.exports = resolvers
