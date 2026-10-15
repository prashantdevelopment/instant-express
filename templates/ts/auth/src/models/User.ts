import mongoose, { type HydratedDocumentFromSchema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // not returned by queries unless asked
  },
  {
    timestamps: true,
    methods: {
      comparePassword(plainPassword: string) {
        return bcrypt.compare(plainPassword, this.password);
      },
    },
    // Never send the password hash in an API response
    toJSON: {
      transform: (doc, ret) => {
        const { password, __v, ...user } = ret;
        return user;
      },
    },
  },
);

// Hash the password before saving (only when it changed)
userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

export type UserDocument = HydratedDocumentFromSchema<typeof userSchema>;

export default mongoose.model('User', userSchema);
