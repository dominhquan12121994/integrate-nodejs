export const MsbConfig = {
    apiUrl: process.env.MSB_URL || 'https://acq-stating.msb.com.vn/v1/api/msb/acq-hub/wallet/',
    merchantName: process.env.MSB_MERCHANT_NAME || '9Pay',
    mId: process.env.MSB_MID || 'NP156',
    tId: process.env.MSB_TID || 'NP156',
    accessCode: process.env.MSB_ACCESS_CODE || 'NinePay@2022',
    defaultOtp: process.env.MSB_DEFAULT_OTP || '456789',
    isUat: process.env.MSB_IS_UAT || false,
    checkBalance: process.env.MSB_CHECK_BALANCE || false,
    transactionIdPrefix: process.env.MSB_TRANSACTION_ID_PREFIX || '9Pay',
}