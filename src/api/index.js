const api = {
  Login: '/erp-organize-service/organize/account/login',
  Logout: '/erp-organize-service/organize/account/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/erp-organize-service/organize/account/getCurrentUser',
  getOrgUser: '/erp-organize-service/organize/user/getOrgUser'
}
export default api
