import * as Yup from "yup";
//  import { ValidationMessage } from '../configs/ValidationMessage';

// Login Form Validation
export const loginValidation = Yup.object().shape({
  username: Yup.string()
    .email("Enter a valid email ID")
    .max(64,"Email ID cannot be greater than 64 characters")
    .required("Enter a valid email ID"),
  password: Yup.string().required("Enter a valid password"),
});

// SignUp Form Validation
export const signUpValidation = Yup.object().shape(
  {
    firstName: Yup.string().strict(true).max(40,"First name cannot be greater than 40 characters").matches(/^\w+(\s+)*$/,"First name cannot contain spaces").matches(/^[a-zA-Z_ ]*$/,"First name can contain only alphabets").required("Enter a First name"),
    lastName: Yup.string().strict(true).max(40,"Last name cannot be greater than 40 characters").matches(/^\w+(\s+)*$/,"Last name cannot contain spaces").matches(/^[a-zA-Z_ ]*$/,"Last name can contain only alphabets").required("Enter a Last name"),
    dateOfBirth: Yup.string().required("Select Date of birth"),
    gender:Yup.string().required("Select your gender"),
    email: Yup.string().email("Enter valid email").max(64,"Email ID cannot be greater than 64 characters").required("Enter a Email"),
    mobile: Yup.string().matches(/^[0-9]{11}$/,"Enter a valid mobile number"),
    zipcode: Yup.string().strict(true).matches(/^[0-9]*$/,"zipcode can contain only digits").required("Enter a Zip Code"),
    password: Yup.string().strict(true).required("Enter a Password")
    .min(8, 'Password must contain 8 characters')
    .max(16, 'Password cannot be greater than 16 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{1,})/,
      "Must contain 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character"
    ),
    confirmPassword: Yup.string()
    .strict(true).required("Enter a Confirm Password")
    .oneOf([Yup.ref("password"), null], "Password mismatch")
   
  },
  ["mobile", "email"]
);

export const myProfilePatientValidation = Yup.object().shape(
  {
    firstName: Yup.string().strict(true).max(40,"First name cannot be greater than 40 characters").matches(/^\w+(\s+)*$/,"First name cannot contain spaces").matches(/^[a-zA-Z_ ]*$/,"First name can contain only alphabets").required("Enter a First name"),
    lastName: Yup.string().strict(true).max(40,"Last name cannot be greater than 40 characters").matches(/^\w+(\s+)*$/,"Last name cannot contain spaces").matches(/^[a-zA-Z_ ]*$/,"Last name can contain only alphabets").required("Enter a Last name"),
    dateOfBirth: Yup.string().required("Select Date of birth"),
    gender:Yup.string().required("Select your gender"),
    email: Yup.string().email("Enter valid email").max(64,"Email ID cannot be greater than 64 characters").required("Enter a Email"),
    mobile: Yup.string().matches(/^[0-9]{11}$/,"Enter a valid mobile number") 
  },
  ["mobile", "email"]
);

export const myProfileValidation = Yup.object().shape(
  {
    firstName: Yup.string().strict(true).max(40,"First name cannot be greater than 40 characters").matches(/^[a-zA-Z_ ]*$/,"First name can contain only alphabets").matches(/^\w+(\s+)*$/,"First name cannot contain spaces").required("Enter a First name"),
    lastName: Yup.string().strict(true).max(40,"Last name cannot be greater than 40 characters").matches(/^[a-zA-Z_ ]*$/,"Last name can contain only alphabets").matches(/^\w+(\s+)*$/,"Last name cannot contain spaces").required("Enter a Last name"), 
    mobile: Yup.string().matches(/^[0-9]{11}$/,"Enter a valid mobile number"),
    prefix: Yup.string().strict(true).matches(/^[a-zA-Z_ ]*$/,"Prefix can contain only alphabets").matches(/^\w+(\s+)*$/,"Prefix cannot contain spaces").max(4,'Enter less than 4 characters').nullable(),
    suffix: Yup.string().strict(true).matches(/^[a-zA-Z_ ]*$/,"Suffix can contain only alphabets").matches(/^\w+(\s+)*$/,"Suffix cannot contain spaces").max(4,'Enter less than 4 characters').nullable()

  }
);

export const emrvalidation = Yup.object().shape(
  {
    iframeLink: Yup.string().when("hasIframeLink", {
      is: (hasIframeLink) => hasIframeLink === true,
      then: Yup.string().url("Enter a valid Url").required("Enter a Url"),
      otherwise: Yup.string(),
    }),
    feePerVisit: Yup.string().when("hasSkipPayment", {
      is: (hasSkipPayment) => hasSkipPayment === false,
      then: Yup.string().required("Enter fee per televisit").max(10,"Fee cannot be greater than 10 digits")
      .matches(/^\d*\.{0,1}\d*$/,"Fee can contain only digits").nullable(),
      otherwise: Yup.string().nullable(),
    })
  }
);

 
export const changePasswordValidation = Yup.object().shape({
  oldPassword: Yup.string().required("Enter the current password "),
  password: Yup.string().required("Enter the new password") 
  .min(8, 'Password must contain 8 characters')
  .max(16, 'Password cannot be greater than 16 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{1,})/,
    "Must contain 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character"
  ).when(['oldPassword'], {
    is: oldPassword => oldPassword != null && oldPassword != undefined && oldPassword != "",
    then: Yup.string().required("Enter the new password").notOneOf([Yup.ref('oldPassword'),null],'New password cannot be same as old password')
  }),
  confirmPassword: Yup.string()
    .required("Retype the new password")
    .when(['oldPassword'], {
      is: oldPassword => oldPassword != null && oldPassword != undefined && oldPassword != "",
      then: Yup.string().required("Retype the new password").notOneOf([Yup.ref('oldPassword'),null],'New password cannot be same as old password')
    })
    .oneOf([Yup.ref("password"), null], "Password mismatch")
});

export const paymentValidation = Yup.object().shape({
  nameOnCard: Yup.string().max(40,"Name cannot be greater than 40 characters").matches(/^[a-zA-Z_ ]*$/,"Name can contain only alphabets").required("Enter a valid name"),
  cardnumber: Yup.string().required("Enter a valid number"),
  'exp-date': Yup.string().required("Enter a valid date"),
  cvc: Yup.string().required("Enter a valid number"),
  city: Yup.string().required("Enter a valid city"),
  address: Yup.string().required("Enter a valid address"),
  postal_code: Yup.string().required("Enter a valid postal code"),
  state: Yup.string().required("Enter a valid state"),
});

export const forgotPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email ID")
    .max(64,"Email ID cannot be greater than 64 characters")
    .required("Enter your registered email ID"),
});
export const resetPasswordValidation = Yup.object().shape({
  new_password: Yup.string().required("Enter a new password")
  .min(8, 'Password must contain 8 characters')
  .max(16, 'Password cannot be greater than 16 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{1,})/,
    "Must contain 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character"
  ),
  retype_password: Yup.string()
    .required("Re-enter the new password")
    .oneOf([Yup.ref("new_password"), null], "Password mismatch"),
});

export const appointmentValidation = Yup.object().shape({
  patientId: Yup.string().required("Select Patient Name"),
  doctorId: Yup.string().required("Select Doctor Name"),
  date: Yup.string().required("Select Appointment Date"),
  time: Yup.string().required("Select Appointment Time"),
  length: Yup.string().required("Select Appointment Length"),
});

export const patientAppointmentValidation = Yup.object().shape({
 // patientId: Yup.string().required("Select Patient Name"),
  //doctorId: Yup.string().required("Select Doctor Name"),
  date: Yup.string().required("Select Appointment Date"),
  time: Yup.string().required("Select Appointment Time"),
  length: Yup.string().required("Select Appointment Length"),
});

export const checkOTP = Yup.object().shape({
  otp: Yup.string().required("Enter  OTP "),
});

export const patientIntakeValidation = Yup.object().shape({
  pharmacySearch: Yup.string().required("Enter pharmacy keywords"),
});
