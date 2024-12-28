import { z } from 'zod';
import { zfd } from 'zod-form-data';

const schema = zfd.formData({
  username: zfd.text(z.string().min(1, 'Username is required')),
  confirmationCode: zfd.text(z.string().min(6, '6-Digit Confirmation Code Required'))
});

export default schema;