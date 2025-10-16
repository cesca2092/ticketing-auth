import mongoose from "mongoose";
import { Password } from "../services/password";

// An Interface that describes the properties that
// are required to create an user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface that describes the properties 
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password; // delete propertie from object
    },
    versionKey: false,
  }
});

userSchema.pre('save', async function (done) {
  // this -> current user, that's why we use function nor arrow
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// ------------------------------- Generic syntax
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };