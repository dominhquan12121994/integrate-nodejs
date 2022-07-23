export const MsbConstant = {
    bankName: 'MSB',
    bankCode: 'MSB',

    successCode: '0',
    errorCode: '99',

    walletTypeAccount: 'direct',
    walletTypeAtm: 'atm',

    linkAtmAction: 'wallet-process/enrollments',
    linkAccountAction: 'wallet-process/enrollments-by-account',
    activeOtpAction: 'wallet-process/activatedToken',
    checkOtpLinkAction: 'verifyotp',
    depositAction: 'wallet-process/cashIn',
    checkOtpDepositAction: 'wallet-process/verifyTransactions',
    withdrawAction: 'wallet-process/cashOut',
    verifyOtp: 'verifyTransactions',
    accountInquireAction: 'account-inquiry',
    accountHistoryInquireAction: 'account-inquiry/history',
    transactionInquireAction: 'inquiry-transaction',
    checkAccountBalanceAction: 'queryaccountbalance',
}