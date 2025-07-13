"use client";

import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/root";
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp, updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

// Define the Order type based on your form data
interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
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

export default function JobsPage() {
    const { user, userRole } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const takeJobHandler = async (id: string) => {
        if (userRole === "worker") {
            if (user) {
                // UPDATE ORDER STATUS TO "IN PROGRESS"
                const orderRef = doc(db, "orders", id);
                await updateDoc(orderRef, {
                    status: "IN PROGRESS"
                });
                toast.success("Job taken successfully");
                router.refresh();
            }
        } else {
            toast.error("You are not authorized to take jobs");
        }
    }

    const completeJobHandler = async (order: Order) => {
        if (userRole === "worker" && user) {
            try {
                // Update order status
                const orderRef = doc(db, "orders", order.id);
                await updateDoc(orderRef, {
                    status: "COMPLETED",
                    completedAt: new Date(),
                    completedBy: user.uid
                });

                // Send email notification
                const emailResponse = await fetch('/api/email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: order.customerEmail, // Customer email
                        subject: `Job Completed - Order #${order.id.slice(-8)}`,
                        clientName: order.customerName,
                        technicianName: order.assignedTechnician,
                        orderId: order.id,
                        service: order.service, // Added service for context
                        time: new Date().toLocaleString('en-MY', {
                            timeZone: 'Asia/Kuala_Lumpur'
                        }),
                        type: "customer"
                    })
                });

                if (emailResponse.ok) {
                    toast.success("Job completed and customer notified via email!");
                } else {
                    toast.success("Job completed!");
                    toast.warning("Failed to send email notification");
                }

                router.refresh();

            } catch (error) {
                console.error("Error completing job:", error);
                toast.error("Failed to complete job");
            }
        }
    };

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
                <h1 className="text-2xl font-bold">Jobs</h1>
                <div className="text-sm text-muted-foreground">
                    {orders.length} {orders.length === 1 ? 'job' : 'jobs'}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders found. Create your first order!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">{order.service}</CardTitle>
                                <span className="text-sm text-muted-foreground">#{order.id.slice(-8)}</span>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <p className="text-xl text-muted-foreground">{order.adminNotes}</p>
                                </div>

                                <Separator className="my-4" />

                                <div className="grid grid-cols-2 gap-2 text-sm">
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
                            </CardContent>
                            <CardFooter>

                                {order.status === "PENDING" && (
                                    <Button onClick={() => takeJobHandler(order.id)}>Take Job</Button>
                                )}

                                {order.status === "IN PROGRESS" && (
                                    <Button onClick={() => completeJobHandler(order)}>Job Completed</Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 