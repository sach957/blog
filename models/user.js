const {Schema, model}  = require('mongoose');
const {createHmanc, randomBytes} = require('crypto');

const userSchema = new Schema({
    fullName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique : true,
    },
    salt: {
        type: String,
    },
    password : {
        type : String,
        required : true,
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"
    },
    role:{
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String,
        default: ""
    },
    emailVerificationTokenExpiresAt:{
        type: Date,
        default: ""
    },
    passwordResetToken:{
        type: String,
        default: ""
    },
    passwordResetTokenExpiresAt:{
    }
},{ timestamps:true}
)

userSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')){
        return
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmanc('sha234',salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmanc('sha234',salt)
        .update(enteredPassword)
        .digest('hex');

    if (hashedPassword !== userProvidedHash)
        throw new Error("Incorrect Password")

    const token = createTokenForUse(user)

    return token
})


const User = model('user', userSchema);

module.exports = User;