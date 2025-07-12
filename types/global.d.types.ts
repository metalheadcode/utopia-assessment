// Global types for the entire application
// Based on data structure from dummy.json

export interface Order {
    orderId: string;
    customerName: string;
    address: string;
    service: string;
    assignedTechnician: string;
    status: OrderStatus;
}

export interface Technician {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface AppData {
    orders: Order[];
    technicians: Technician[];
}

// Order status types
export type OrderStatus =
    | "Pending"
    | "In Progress"
    | "Completed"
    | "Cancelled"
    | "On Hold";

// Service types
export type ServiceType =
    | "Aircond cleaning"
    | "Aircond repair"
    | "Aircond installation"
    | "Aircond maintenance"
    | "Other";

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    search?: string;
    status?: OrderStatus;
    technician?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Form types
export interface CreateOrderForm {
    customerName: string;
    address: string;
    service: ServiceType;
    assignedTechnician: string;
}

export interface UpdateOrderForm {
    orderId: string;
    status?: OrderStatus;
    assignedTechnician?: string;
    service?: ServiceType;
}

export interface CreateTechnicianForm {
    name: string;
    email: string;
    phone: string;
    address: string;
}

// Filter and search types
export interface OrderFilters {
    status?: OrderStatus;
    technician?: string;
    service?: ServiceType;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

// Dashboard stats types
export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalTechnicians: number;
    ordersByStatus: Record<OrderStatus, number>;
    recentOrders: Order[];
}

// Navigation types
export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    children?: NavItem[];
}

// User types (for future authentication)
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export type UserRole = "admin" | "manager" | "technician" | "viewer";

// Theme types
export interface Theme {
    name: string;
    value: "light" | "dark" | "system";
}

// Notification types
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    timestamp: Date;
    read: boolean;
}

// Export all types as a namespace for easy access
export namespace AppTypes {
    export type Order = Order;
    export type Technician = Technician;
    export type AppData = AppData;
    export type OrderStatus = OrderStatus;
    export type ServiceType = ServiceType;
    export type ApiResponse<T> = ApiResponse<T>;
    export type PaginationParams = PaginationParams;
    export type PaginatedResponse<T> = PaginatedResponse<T>;
    export type CreateOrderForm = CreateOrderForm;
    export type UpdateOrderForm = UpdateOrderForm;
    export type CreateTechnicianForm = CreateTechnicianForm;
    export type OrderFilters = OrderFilters;
    export type DashboardStats = DashboardStats;
    export type NavItem = NavItem;
    export type User = User;
    export type UserRole = UserRole;
    export type Theme = Theme;
    export type Notification = Notification;
}
