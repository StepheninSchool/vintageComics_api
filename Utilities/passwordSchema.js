import PasswordValidator from "password-validator";

const passwordSchema = new PasswordValidator();

passwordSchema
  .is().min(8)                                   // Minimum length 8
  .has().uppercase(1)                             // Must have at least one uppercase letter
  .has().lowercase(1)                             // Must have at least one lowercase letter
  .has().digits(1)                               // Must have at least two digits

export default passwordSchema;