// Import the PasswordValidator library 
import PasswordValidator from "password-validator";

// Create a new password schema instance
const passwordSchema = new PasswordValidator();

// Defined password validation rules
passwordSchema
  .is().min(8)              // Minimum length 8
  .has().uppercase(1)       // Must have at least one uppercase letter                      
  .has().lowercase(1)       // Must have at least one lowercase letter                      
  .has().digits(1)           // Must have at least one digit               


export default passwordSchema;