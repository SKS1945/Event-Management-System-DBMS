import { Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PaymentStatus, RegistrationStatus, PaymentMethod } from '@prisma/client';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

// Initialize Razorpay SDK instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
  return new Razorpay({ key_id, key_secret });
};

// Create Razorpay Order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { registrationId } = req.body;
    if (!registrationId) {
      res.status(400).json({ message: 'Registration ID is required' });
      return;
    }

    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(registrationId, 10) },
      include: { event: true, payment: true },
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    if (registration.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Unauthorized to pay for this registration' });
      return;
    }

    if (registration.status === RegistrationStatus.CONFIRMED && registration.payment?.status === PaymentStatus.SUCCESS) {
      res.status(400).json({ message: 'Registration is already confirmed and paid' });
      return;
    }

    const feeAmount = Number(registration.event.fee);
    if (feeAmount <= 0) {
      // Event is free - confirm immediately without payment
      await prisma.registration.update({
        where: { id: registration.id },
        data: { status: RegistrationStatus.CONFIRMED },
      });
      res.status(200).json({
        message: 'Event is free. Registration confirmed!',
        orderId: null,
        amount: 0,
      });
      return;
    }

    const amountInPaise = Math.round(feeAmount * 100);
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    let orderId: string;

    // Check if we have valid real Razorpay test credentials or placeholder
    if (keyId.startsWith('rzp_test_') && keyId !== 'rzp_test_placeholder' && keySecret !== 'placeholder_secret') {
      try {
        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_reg_${registration.id}_${Date.now()}`,
          notes: {
            registrationId: String(registration.id),
            eventId: String(registration.eventId),
            userId: String(registration.userId),
          },
        });
        orderId = order.id;
      } catch (err: any) {
        console.warn('Razorpay API error, falling back to sandbox simulator:', err.message);
        orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
      }
    } else {
      // Sandbox Simulator Order
      orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    }

    // Upsert Payment record with status PENDING
    const payment = await prisma.payment.upsert({
      where: { registrationId: registration.id },
      create: {
        registrationId: registration.id,
        amount: feeAmount,
        method: PaymentMethod.UPI,
        status: PaymentStatus.PENDING,
        razorpayOrderId: orderId,
      },
      update: {
        amount: feeAmount,
        status: PaymentStatus.PENDING,
        razorpayOrderId: orderId,
      },
    });

    res.status(200).json({
      orderId,
      amount: feeAmount,
      amountInPaise,
      currency: 'INR',
      keyId,
      paymentId: payment.id,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// Verify Razorpay Payment Signature
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const {
      registrationId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      method,
    } = req.body;

    if (!registrationId || !razorpayOrderId || !razorpayPaymentId) {
      res.status(400).json({ message: 'Missing payment verification parameters' });
      return;
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    let isValid = false;

    if (keySecret !== 'placeholder_secret' && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
    } else {
      // Sandbox mode: approve test transactions
      isValid = true;
    }

    if (!isValid) {
      res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
      return;
    }

    // Atomic Database Transaction (ACID compliance in DBMS)
    const result = await prisma.$transaction(async (tx) => {
      // Update Payment status to SUCCESS
      const payment = await tx.payment.update({
        where: { registrationId: parseInt(registrationId, 10) },
        data: {
          status: PaymentStatus.SUCCESS,
          razorpayPaymentId,
          razorpaySignature: razorpaySignature || 'sandbox_verified_signature',
          paidAt: new Date(),
          method: method && Object.values(PaymentMethod).includes(method) ? method : PaymentMethod.UPI,
        },
      });

      // Update Registration status to CONFIRMED
      const registration = await tx.registration.update({
        where: { id: parseInt(registrationId, 10) },
        data: { status: RegistrationStatus.CONFIRMED },
        include: { event: true },
      });

      return { payment, registration };
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Registration is now confirmed.',
      payment: result.payment,
      registration: result.registration,
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// Admin: Get All Payments Ledger
export const getAllPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const { status } = req.query;
    const where: any = {};

    if (status && Object.values(PaymentStatus).includes(status as PaymentStatus)) {
      where.status = status as PaymentStatus;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        registration: {
          include: {
            user: { select: { id: true, name: true, email: true, department: true, phone: true } },
            event: { select: { id: true, title: true, category: true, fee: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Summary statistics for ledger
    const totalCollected = payments
      .filter((p) => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    res.status(200).json({
      payments,
      summary: {
        totalRecords: payments.length,
        totalCollected,
        successCount: payments.filter((p) => p.status === PaymentStatus.SUCCESS).length,
        pendingCount: payments.filter((p) => p.status === PaymentStatus.PENDING).length,
        refundedCount: payments.filter((p) => p.status === PaymentStatus.REFUNDED).length,
      },
    });
  } catch (error) {
    console.error('getAllPayments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments ledger' });
  }
};
