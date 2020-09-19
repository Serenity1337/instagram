const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

const User = require('../../models/userModel')

module.exports = {
  createUser: async args => {
    const existingEmail = await User.findOne({ email: args.userInput.email})
    if (existingEmail) {
      throw new Error('Email is already in use')
    }
    const existingUser = await User.findOne({userName: args.userInput.userName})
    if (existingUser) {
      throw new Error('Username is already in use')
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
    const user = new User({
      userName: args.userInput.userName,
      password: hashedPassword,
      email: args.userInput.email,
      avatar: args.userInput.avatar,
      followedBy: args.userInput.followedBy,
      following: args.userInput.following
    });
    return user
      .save()
      .then(result => {
        console.log(result);
        return { ...result._doc,password: null, _id: result._doc._id.toString() };
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
//   login: async ({email, password}) => {
//     const checkUser = await User.findOne({email: email})
//     if (checkUser === null) {
//       throw new Error('User does not exist')
//     } 
//       console.log(checkUser)
//       const isEqual = await bcrypt.compare(password, checkUser.password);
//       console.log(isEqual)
//       if (!isEqual) {
//         throw new Error('Password is incorrect!')
//       } 
//         const token = JWT.sign({userId: `${checkUser.id}`, email: checkUser.email}, 'verylongtokenkeystring', {expiresIn: '1h'})
//         return {token: token, tokenExpiration: 1, userId: checkUser.id}
        
        
      
    
    
    
// },
login: async ({ email, password }) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error('User does not exist!');
  }
  console.log(user)
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new Error('Password is incorrect!');
  }
  console.log(isEqual)
  const token = JWT.sign(
    { userId: user.id, email: user.email },
    'somesupersecretkey',
    {
      expiresIn: '1h'
    }
  );
  return { userId: user.id, token: token, tokenExpiration: 1 };
},
userUpdate: args => {
  return new Promise ((resolve, reject)=> {
    User.findOneAndUpdate(
      {_id: args.userUpdateInput.id},
      {
        $set: {
          avatar: args.userUpdateInput.avatar,
          followedBy: args.userUpdateInput.followedBy,
          following: args.userUpdateInput.following
        },

      },
      {new: true},
      
    )
  .exec((err, res) => {
        console.log('test', res)
        if(err) reject(err)
        else resolve(res)
    })
  })
},


user: (id) => {
   return User.findById(id.id)
 
  
},
}