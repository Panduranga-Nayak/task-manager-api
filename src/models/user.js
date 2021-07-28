const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive Number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw Error('Email is Invalid')
            }
        }
    },
    password:{
        type: String,
        trim: true,
        required:true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw Error('Password is easy to guess');
            }
        }
    },
    tokens:[{
        token: {
            type: String,
            required:true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})



//statics are methods defined on model
userSchema.statics.findByCredintials = async(email,password)=>{
    const user = await User.findOne({email: email})

    if(!user){
        throw new Error("Unable to login")
    }
    
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw new Error("Unable to login")
    }
    
    return user
}

//methods r defined on document instance
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user.id.toString() },'thisiscrazy')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}



//hash the plain text before saving
//regular function is used because "this" will be in refernece with the userSchema
userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)

    }
    
    next()
})
//delete user task when user is removed
userSchema.pre('remove', async function(next){
    const user = this

    await Task.deleteMany({owner:user._id})

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User;