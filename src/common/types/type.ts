export interface Email {
  email: string;
}

export interface ConfirmResetPasswordToken {
  email: string;
  newPassword: string;
}
