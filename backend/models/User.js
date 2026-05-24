import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema=new mongoose.Schema(
{
    username:{
        type:String,
        required:[true,'PLEASE PROVIDE A USERNAME'],
        unique:true,
        trim:true,
        minlength:[3,'USERNAME MUST BE ATLEAST 3 CHARACTERS'],
    },

    email:{
        type:String,
        required:[true,'PLEASE PROVIDE AN EMAIL'],
        unique:true,
        lowercase:true,
        match:[
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'PLEASE PROVIDE A VALID EMAIL'
        ]
    },

    password:{
        type:String,
        required:[true,'PLEASE PROVIDE A PASSWORD'],
        minlength:[6,'PASSWORD MUST BE ATLEAST 6 CHARACTERS'],
        select:false
    },

    profileImage:{
        type:String,
        default:null
    }

},
{
    timestamps:true
}
);

// Hash password before saving
userSchema.pre('save',async function(){

    // Only hash if password modified
    if(!this.isModified('password')){
        return;
    }

    // Generate salt
    const salt=await bcrypt.genSalt(10);

    // Hash password
    this.password=await bcrypt.hash(
        this.password,
        salt
    );
});

// Compare password method
userSchema.methods.matchPassword=async function(
    enteredPassword
){
    return await bcrypt.compare(
        enteredPassword,
        this.password
    );
};

const User=mongoose.model('User',userSchema);

export default User;