export type Role = 'ADMIN' | 'USER';

export type Category = 'TECH' | 'CULTURAL' | 'WORKSHOP' | 'INFORMALS';

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  department?: string | null;
  createdAt?: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  venue: string;
  date: string;
  maxCapacity: number;
  fee: number | string;
  category: Category;
  imageUrl?: string | null;
  status: EventStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
  _count?: {
    registrations: number;
  };
  registrations?: Registration[];
}

export interface Registration {
  id: number;
  userId: number;
  eventId: number;
  status: RegistrationStatus;
  registeredAt: string;
  user?: User;
  event?: EventItem;
  payment?: Payment | null;
}

export interface Payment {
  id: number;
  registrationId: number;
  amount: number | string;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  paidAt?: string | null;
  createdAt: string;
  registration?: Registration;
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
  activeUsers: number;
  categoryCounts: Record<Category, number>;
  recentRegistrations: Registration[];
  recentEvents: EventItem[];
}
