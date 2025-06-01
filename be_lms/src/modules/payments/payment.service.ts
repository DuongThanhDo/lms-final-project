import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { Payment } from './payment.entity';
import { StatusPayment } from 'src/common/constants/enum';
import { ConfigService } from '@nestjs/config';
import { getVnpConfig } from 'src/config/vnp.config';
import { User } from '../users/user.entity';
import { Course } from '../courses/courses.entity';
import { VnpayService } from 'nestjs-vnpay';
import { BuildPaymentUrl, ProductCode, VnpCurrCode, VnpLocale } from 'vnpay';
import { StepStatus, TransactionStatus, vnp_ResponseCode } from './constants';
import { Invoice } from './Invoice/invoices.entity';
import { CourseRegistrationsService } from '../registrations/course-registrations.service';

@Injectable()
export class PaymentService {
  private readonly vnpConfig;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    private vnpayService: VnpayService,
    private courseRegRepo: CourseRegistrationsService,
    private configService: ConfigService,
  ) {
    this.vnpConfig = getVnpConfig();
  }

  async payInvoice(invoiceModel: any) {
    try {
      const invoiceEntity = new Invoice();
      const payment = new Payment();
      const createDate = await this.convertVNPayDate(
        invoiceModel.vnp_CreateDate.toString(),
      );
      const course = await this.courseRepository.findOne({
        where: { id: Number(invoiceModel.courseId) },
      });
      const user = await this.userRepository.findOne({
        where: { id: Number(invoiceModel.userId) },
      });
      payment.user = user;
      payment.amount = invoiceModel.vnp_Amount;
      payment.vnp_txn_ref = invoiceModel.vnp_TxnRef;
      payment.status = StatusPayment.PENDING;

      await this.paymentRepository.save(payment);

      invoiceEntity.user = user;
      invoiceEntity.amount = invoiceModel.vnp_Amount;
      invoiceEntity.invoice_code = invoiceModel.vnp_TxnRef;
      invoiceEntity.invoice_date = createDate;
      invoiceEntity.payment = payment;
      invoiceEntity.course = course;

      await this.invoiceRepository.save(invoiceEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async createPayment(courseId: number, userId: number, amount: number) {
    const vnp_TxnRef = Date.now().toString();
    const createDate = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);

    let vnp_Params: BuildPaymentUrl = {
      vnp_Locale: VnpLocale.VN,
      vnp_CurrCode: VnpCurrCode.VND,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: `Thanh toán khóa học ${courseId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_Amount: Number(amount),
      vnp_ReturnUrl: this.vnpConfig.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: Number(createDate),
    };

    this.payInvoice({ ...vnp_Params, courseId, userId });

    const urlParam = this.vnpayService.buildPaymentUrl(vnp_Params);
    vnp_Params = this.sortObject(urlParam);
    const digitalSignature = qs.stringify(vnp_Params, { encode: false });

    const paymentUrl = `${this.vnpConfig.vnp_Url}?${qs.stringify(vnp_Params, {
      encode: false,
    })}`;

    return { url: urlParam };
  }

  async UpdatePayment(VNPayUpdateModel: any) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { invoice_code: VNPayUpdateModel.vnp_TxnRef },
        relations: ['payment', 'course'],
      });
      if (!invoice) return;

      const payment = await this.paymentRepository.findOne({
        where: { id: invoice.payment.id },
        relations: ['user'],
      });
      if (!payment) return;

      invoice.status = VNPayUpdateModel.status;
      invoice.message_log = VNPayUpdateModel.message;

      payment.status = VNPayUpdateModel.status;

      await this.invoiceRepository.save(invoice);
      await this.paymentRepository.save(payment);
      console.log("invoice", invoice);
      console.log("payment", payment);
      const courseId = invoice.course?.id || 0

      if(VNPayUpdateModel.status === StatusPayment.COMPLETED) {
        if (!invoice.course?.id || !payment.user?.id) {
          throw new Error('Thiếu courseId hoặc userId');
        }
        
        await this.courseRegRepo.create({
          courseId: invoice.course.id,
          userId: payment.user.id,
        });
      }

      return courseId;

    } catch (error) {
      console.log(error);
    }
  }

  async handlePaymentReturn(query: any) {
    const {
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode,
      vnp_TmnCode,
      vnp_TransactionNo,
      vnp_TransactionStatus,
      vnp_TxnRef,
      vnp_SecureHash,
    } = query;

    let status = '';
    let message = '';

    status = await this.convertStatusPayment(vnp_ResponseCode);
    message = await this.convertMessageLog(vnp_ResponseCode);
    console.log('message: ', message);

    const courseId = await this.UpdatePayment({ ...query, status, message });

    return { status, courseId };
  }

  async convertTransactionStatus(transactionCode: string) {
    let status: string;

    if (
      ['02', '03', '04', '05', '06', '08', '09', '16'].includes(transactionCode)
    ) {
      status = TransactionStatus[transactionCode];
    } else {
      status = 'Unknown transaction code';
    }

    return status;
  }

  async convertMessageLog(status_code: string) {
    let message: string;

    switch (status_code) {
      case '00':
        message = vnp_ResponseCode['00'];
        break;
      case '07':
        message = vnp_ResponseCode['07'];
        break;
      case '09':
        message = vnp_ResponseCode['09'];
        break;
      case '10':
        message = vnp_ResponseCode['10'];
        break;
      case '11':
        message = vnp_ResponseCode['11'];
        break;
      case '12':
        message = vnp_ResponseCode['12'];
        break;
      case '13':
        message = vnp_ResponseCode['13'];
        break;
      case '24':
        message = vnp_ResponseCode['24'];
        break;
      case '51':
        message = vnp_ResponseCode['51'];
        break;
      case '65':
        message = vnp_ResponseCode['65'];
        break;
      case '75':
        message = vnp_ResponseCode['75'];
        break;
      case '79':
        message = vnp_ResponseCode['79'];
        break;
      default:
        message = 'Unknown status code';
    }

    return message;
  }

  async convertStatusPayment(resCode: string) {
    let status: string;

    switch (resCode) {
      case '00':
      case '07':
        status = StatusPayment.COMPLETED;
        break;
      case '09':
      case '10':
      case '11':
      case '12':
      case '13':
      case '24':
      case '51':
      case '65':
      case '75':
      case '79':
        status = StatusPayment.FAILED;
        break;
      default:
        status = StatusPayment.PENDING;
    }

    return status;
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  async convertVNPayDate(dateStr: string) {
    const yyyy = parseInt(dateStr.slice(0, 4));
    const MM = parseInt(dateStr.slice(4, 6)) - 1;
    const dd = parseInt(dateStr.slice(6, 8));
    const HH = parseInt(dateStr.slice(8, 10));
    const mm = parseInt(dateStr.slice(10, 12));
    const ss = parseInt(dateStr.slice(12, 14));

    return new Date(yyyy, MM, dd, HH, mm, ss);
  }
}
