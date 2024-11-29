// frontend/src/routes/merchant/sign-up/schema.js
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');

const schema = zfd.formData({
  businessName: zfd.text(z.string().min(1, 'Business Name is required').max(255, 'Business Name must be 255 characters or less')),
  email: zfd.text(z.string().email('Invalid email address')),
  password: zfd.text(passwordSchema),
  confirmPassword: zfd.text(passwordSchema).refine((val, ctx) => val === ctx.parent.password, {
    message: 'Passwords must match'
  }),
  userGroup: zfd.text(z.literal('merchant'))
});

export default schema;