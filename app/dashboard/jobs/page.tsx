"use client";

import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/firebase/root";
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData, Timestamp } from "firebase/firestore";
import { useEffect, useCallback } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { JobService } from "@/lib/job-service";
import { UserService } from "@/lib/user-service";
import { DelegationManagement } from "@/components/dialogs/delegation-management";

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
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export default function JobsPage() {
    const {
        user,
        userRole,
        availableDelegations,
        currentImpersonation,
        startImpersonation,
        stopImpersonation,
        canPerformAction
    } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const takeJobHandler = async (id: string) => {
        if (!user) return;

        try {
            const context = {
                adminUid: currentImpersonation ? user.uid : undefined,
                workerUid: currentImpersonation ? currentImpersonation.workerUid : user.uid,
                isImpersonation: !!currentImpersonation
            };

            await JobService.takeJob(id, context);

            const message = currentImpersonation
                ? `Job taken successfully as ${currentImpersonation.workerUid}`
                : "Job taken successfully";

            toast.success(message);
            await loadOrders(); // Refresh orders
        } catch (error) {
            console.error("Error taking job:", error);
            toast.error(error instanceof Error ? error.message : "Failed to take job");
        }
    }

    const completeJobHandler = async (order: Order) => {
        if (!user) return;

        try {
            const context = {
                adminUid: currentImpersonation ? user.uid : undefined,
                workerUid: currentImpersonation ? currentImpersonation.workerUid : user.uid,
                isImpersonation: !!currentImpersonation
            };

            await JobService.completeJob(order.id, context);

            // Send email notification
            const emailResponse = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: order.customerEmail,
                    subject: `Job Completed - Order #${order.id.slice(-8)}`,
                    clientName: order.customerName,
                    technicianName: order.assignedTechnician,
                    orderId: order.id,
                    service: order.service,
                    time: new Date().toLocaleString('en-MY', {
                        timeZone: 'Asia/Kuala_Lumpur'
                    }),
                    type: "customer"
                })
            });

            // Send email notification to technician
            try {
                // Get technician's actual email from their profile
                const technicianUid = currentImpersonation ? currentImpersonation.workerUid : user.uid;
                const technicianProfile = await UserService.getUserProfile(technicianUid);

                if (technicianProfile?.email) {
                    const technicianEmailResponse = await fetch('/api/email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            to: technicianProfile.email,
                            subject: `Job Completed - Order #${order.id.slice(-8)}`,
                            clientName: order.customerName,
                            technicianName: technicianProfile.displayName,
                            orderId: order.id,
                            time: new Date().toLocaleString('en-MY', {
                                timeZone: 'Asia/Kuala_Lumpur'
                            }),
                            type: "technician",
                            completedBy: currentImpersonation ? `${user.email} (acting as ${technicianProfile.displayName})` : technicianProfile.displayName
                        })
                    });

                    if (technicianEmailResponse.ok) {
                        toast.success("Technician notified via email!");
                    } else {
                        toast.warning("Failed to send technician notification");
                    }
                } else {
                    console.warn("No email found for technician profile");
                    toast.warning("Technician email not found");
                }
            } catch (error) {
                console.error("Error sending technician notification:", error);
                toast.warning("Failed to send technician notification");
            }

            const message = currentImpersonation
                ? `Job completed successfully as ${currentImpersonation.workerUid}`
                : "Job completed successfully";

            if (emailResponse.ok) {
                toast.success(message + " and customer notified via email!");
            } else {
                toast.success(message);
                toast.warning("Failed to send email notification");
            }

            await loadOrders(); // Refresh orders

        } catch (error) {
            console.error("Error completing job:", error);
            toast.error(error instanceof Error ? error.message : "Failed to complete job");
        }
    };

    const loadOrders = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // If admin and impersonating, show jobs for that worker
            // If worker or admin not impersonating, show own jobs
            const targetUid = currentImpersonation ? currentImpersonation.workerUid : user.uid;

            const ordersCollection = collection(db, "orders");

            // Workers should see jobs assigned to them, regardless of who created the order
            const q = query(
                ordersCollection,
                where("assignedTechnician", "==", targetUid)
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
    }, [user, currentImpersonation]);

    useEffect(() => {
        loadOrders();
    }, [user, currentImpersonation, loadOrders]);

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
                <div>
                    <h1 className="text-2xl font-bold">Jobs</h1>
                    {currentImpersonation && (
                        <Badge variant="secondary" className="mt-1">
                            Acting as worker: {currentImpersonation.workerUid}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {userRole === 'admin' && <DelegationManagement />}
                    <div className="text-sm text-muted-foreground">
                        {orders.length} {orders.length === 1 ? 'job' : 'jobs'}
                    </div>
                </div>
            </div>

            {/* Admin impersonation controls */}
            {userRole === 'admin' && (
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Act as worker:</span>
                        <Select
                            value={currentImpersonation?.id || "__none__"}
                            onValueChange={(value) => {
                                if (value === "__none__") {
                                    stopImpersonation();
                                } else {
                                    const delegation = availableDelegations.find(d => d.id === value);
                                    if (delegation) {
                                        startImpersonation(delegation);
                                    }
                                }
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select worker" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">None (act as self)</SelectItem>
                                {availableDelegations.map((delegation) => (
                                    <SelectItem key={delegation.id} value={delegation.id}>
                                        Worker: {delegation.workerUid}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {currentImpersonation && (
                        <Badge variant="outline">
                            Permissions: {currentImpersonation.permissions.join(', ')}
                        </Badge>
                    )}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-12 h-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <p className="text-muted-foreground">No jobs found. Ask admin or your supervisor to create a job for you.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    {order.status === "PENDING" &&
                                        <Badge variant="secondary" className="text-xs">
                                            {order.status}
                                        </Badge>}
                                    {order.status === "IN PROGRESS" &&
                                        <Badge variant="secondary" className="text-xs">
                                            {order.status}
                                        </Badge>}
                                    {order.status === "COMPLETED" &&
                                        <Badge variant="secondary" className="text-xs">
                                            {order.status}
                                        </Badge>}
                                    <span className="text-sm text-muted-foreground">#{order.id.slice(-8)}</span>
                                </div>
                                <CardTitle className="text-lg font-medium">{order.service}</CardTitle>

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
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                {order.status === "PENDING" && canPerformAction("take_jobs") && (
                                    <Button
                                        onClick={() => takeJobHandler(order.id)}
                                        className="w-full"
                                    >
                                        {currentImpersonation ? `Take Job as ${currentImpersonation.workerUid}` : "Take Job"}
                                    </Button>
                                )}

                                {order.status === "IN PROGRESS" && canPerformAction("complete_jobs") && (
                                    <Button
                                        onClick={() => completeJobHandler(order)}
                                        className="w-full"
                                    >
                                        {currentImpersonation ? `Complete Job as ${currentImpersonation.workerUid}` : "Job Completed"}
                                    </Button>
                                )}

                                {/* Show admin action indicators */}
                                {(order as Order & { takenByAdmin?: string }).takenByAdmin && (
                                    <Badge variant="secondary" className="text-xs">
                                        Taken by admin: {(order as Order & { takenByAdmin?: string }).takenByAdmin}
                                    </Badge>
                                )}
                                {(order as Order & { completedByAdmin?: string }).completedByAdmin && (
                                    <Badge variant="secondary" className="text-xs">
                                        Completed by admin: {(order as Order & { completedByAdmin?: string }).completedByAdmin}
                                    </Badge>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 