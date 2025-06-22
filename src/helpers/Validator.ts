export class Validator {
	// Predefined validators
  static EMAIL = {
    regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    regexMessage: 'Please enter a valid email address.'
  };

  static ADDRESS = {
    regex: /^[A-Za-z0-9\s,.'-]+$/,
    regexMessage: 'Address contains invalid characters.',
  };

  static PHONE = {
    regex: /^(?:\+?\d{10,17})$/,
    regexMessage: 'Phone number is invalid'
  };

  static PASSWORD = {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    regexMessage: 'Password must be at least 8 characters, a number, lowercase, uppercase, and special characters'
  };

  static NUMBER = {
    regex: /^[0-9]+$/,
    regexMessage: 'This field must contain only numbers.'
  };

  static ALPHA = {
    regex: /^[A-Za-z]+$/,
    regexMessage: 'This field must contain only alphabetic characters.'
  };

  static NAME = {
    regex: /^[A-Za-z\s\-']+$/,
    regexMessage: 'Special characters and numbers not allowed'
  };

  static TITLE = {
    regex: /^[A-Za-z\d\:\s\-().&,']+$/,
    regexMessage: 'Only alphabets, numbers and \'():-,\' allowed'
  };

  static QUALIFICATION_NAME = {
    regex: /^[A-Za-z\d\:\s.,&()'-]+$/, // Letters, numbers, spaces, commas, apostrophes, hyphens
    regexMessage: 'Only alphabets, numbers and \'():-,\' allowed',
  };

  static SCHOOL_NAME = {
    regex: /^[A-Za-z0-9\s'-]+$/, // Letters, numbers, spaces, commas, apostrophes, hyphens
    regexMessage: 'School name contains invalid characters.',
  };

  static COMPANY_NAME = {
    regex: /^[A-Za-z0-9\s'-]+$/, // Letters, numbers, spaces, commas, apostrophes, hyphens
    regexMessage: 'School name contains invalid characters.',
  };

  static SKILL_NAME = {
    regex: /^[A-Za-z0-9\s\.\-#\+\/]+$/,
    regexMessage: 'Allowed characters are Digits, . # + /'
  }

  static CERT_NAME = {
    regex: /^[A-Za-z0-9\s\-\.\(\)&\|',+]+$/,
    regexMessage: 'Allowed characters are Digits, . # + / ( ) | &'
  }

  static URL = {
    regex: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
    regexMessage: 'Invalid link'
  }

  validate = (obj: Record<string, any>) => {
    for (const key in obj) {
			const field = obj[key];

		if (typeof field == "string" && !field)
			throw `${key} is required`;
		
		if (typeof field == "object") {
				const { value, min, max, is, type, ntu } = field;

        if (ntu && !value.trim()) continue;
        
        if (!value.trim()) throw `${key} is required`;

        if (min && value.length < min)
          throw `${key} must be at least ${min} characters long`;

        if (max && value.length > max)
          throw `${key} must be not more than ${max} characters long`;

        if (
          is &&
          is[0] &&
          value != obj[is[0]].value
        ) {
          if (is[1]) throw is[1];

          throw `${key} must be the same as ${is[0]}`;
        }

				if (type && type.regex && !type.regex.test(value)) {
          const errorMessage = type.regexMessage || `${key} has an invalid format.`;

					throw errorMessage;
        }
      }
    }
  };
}

export default new Validator();