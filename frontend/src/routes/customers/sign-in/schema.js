import { z } from 'zod';
import { zfd } from 'zod-form-data';

const schema = zfd.formData({
  email: zfd.text(z.string().email('Invalid email address')),
  password: zfd.text(z.string().min(8, 'Password must be at least 8 characters long'))
});

export default schema;