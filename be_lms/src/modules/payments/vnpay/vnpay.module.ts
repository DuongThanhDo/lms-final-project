import { Module } from "@nestjs/common";
import { VnpayModule } from "nestjs-vnpay";
import { getVnpConfig } from "src/config/vnp.config";
import { HashAlgorithm, ignoreLogger } from "vnpay";

const vnpayConfig = getVnpConfig()

@Module({
  imports: [VnpayModule.register({
    tmnCode: vnpayConfig.vnp_TmnCode || '',
    secureSecret: vnpayConfig.vnp_SecureSecret || '',
    vnpayHost: vnpayConfig.vnp_Url || '',
    testMode: !!vnpayConfig.testMode,
    hashAlgorithm: HashAlgorithm.SHA512,
    loggerFn: ignoreLogger
  })],
  controllers: [],
  providers: [],
  exports: [VnpayModule]
})
export class VNPaymentModule {}