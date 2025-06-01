export const getVnpConfig = () => ({
  vnp_TmnCode: process.env.VNP_TMNCODE,
  vnp_SecureSecret: process.env.VNP_SECURESECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_ReturnUrl: process.env.VNP_RETURN_URL,
  testMode: process.env.VNP_TESTMODE,
  hashAlgorithm: process.env.VNP_HASHALGORITHM
});