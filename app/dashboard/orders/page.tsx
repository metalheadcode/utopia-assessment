"use client";

import { useAuth } from "@/app/context/auth-context";
import { db } from "@/firebase";
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

// Define the Order type based on your form data
interface Order {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    service: string;
    quotedPrice: number;
    assignedTechnician: string;
    adminNotes?: string;
    submittedBy: string;
    submittedByEmail: string;
    status: string;
    createdAt: Timestamp; // Firestore timestamp
    updatedAt: Timestamp; // Firestore timestamp
}

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const ordersCollection = collection(db, "orders");

                // Query orders where the current user is the submitter
                const q = query(
                    ordersCollection,
                    where("submittedBy", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data()
                })) as Order[];

                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-lg">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Orders</h1>
                <div className="text-sm text-muted-foreground">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders found. Create your first order!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{order.customerName}</h3>
                                <span className="text-sm text-muted-foreground">#{order.id.slice(-8)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Service:</span> {order.service}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Price:</span> RM {order.quotedPrice}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Technician:</span> {order.assignedTechnician}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Status:</span> {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 