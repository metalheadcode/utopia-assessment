"use client";

import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Clock, User, Wrench, Coins, Map, QuoteIcon, Check, Workflow, Hand, Eye, Loader } from "lucide-react";


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
    const [technicianNames, setTechnicianNames] = useState<Record<string, string>>({});
    const [jobTakenLoading, setJobTakenLoading] = useState(false);
    const [jobCompletedLoading, setJobCompletedLoading] = useState(false);
    // Function to get technician display name
    const getTechnicianName = (uid: string): string => {
        return technicianNames[uid] || uid.slice(-6); // Fallback to last 6 chars of UID
    };

    const takeJobHandler = async (id: string) => {
        if (!user) return;

        // Find the order to check assignment
        const order = orders.find(o => o.id === id);
        if (!order) return;

        // Check if user can take this specific job
        const targetUid = currentImpersonation ? currentImpersonation.workerUid : user.uid;
        if (userRole === 'admin' && !currentImpersonation && order.assignedTechnician !== user.uid) {
            toast.error("You can only take jobs assigned to you. Use impersonation to act as a worker.");
            return;
        }
        if (order.assignedTechnician !== targetUid) {
            toast.error("This job is not assigned to you.");
            return;
        }

        setJobTakenLoading(true);
        try {
            const context = {
                adminUid: currentImpersonation ? user.uid : undefined,
                workerUid: currentImpersonation ? currentImpersonation.workerUid : user.uid,
                isImpersonation: !!currentImpersonation
            };


            await JobService.takeJob(id, context);

            const message = currentImpersonation
                ? `Job taken successfully as ${getTechnicianName(currentImpersonation.workerUid)}`
                : "Job taken successfully";

            toast.success(message);
        } catch (error) {
            console.error("Error taking job:", error);
            toast.error(error instanceof Error ? error.message : "Failed to take job");
        } finally {
            setJobTakenLoading(false);
            await loadOrders(); // Refresh orders
        }
    }

    const completeJobHandler = async (order: Order) => {
        if (!user) return;

        setJobCompletedLoading(true);

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
            } finally {
                setJobCompletedLoading(false);
                await loadOrders(); // Refresh orders
            }

            const message = currentImpersonation
                ? `Job completed successfully as ${getTechnicianName(currentImpersonation.workerUid)}`
                : "Job completed successfully";

            if (emailResponse.ok) {
                toast.success(message + " and customer notified via email!");
            } else {
                toast.success(message);
                toast.warning("Failed to send email notification");
            }

        } catch (error) {
            console.error("Error completing job:", error);
            toast.error(error instanceof Error ? error.message : "Failed to complete job");
        } finally {
            setJobCompletedLoading(false);
            await loadOrders(); // Refresh orders
        }
    };

    const loadOrders = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const ordersCollection = collection(db, "orders");
            let q;

            if (userRole === 'admin' && !currentImpersonation) {
                // Admin not impersonating - show ALL jobs
                q = query(ordersCollection);
            } else {
                // Worker OR admin impersonating - show jobs assigned to specific technician
                const targetUid = currentImpersonation ? currentImpersonation.workerUid : user.uid;
                q = query(
                    ordersCollection,
                    where("assignedTechnician", "==", targetUid)
                );
            }

            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];

            // Fetch technician names for all unique technician UIDs (orders + delegations)
            const orderTechnicianUids = [...new Set(ordersData.map(order => order.assignedTechnician))];
            const delegationTechnicianUids = availableDelegations.map(d => d.workerUid);
            const uniqueTechnicianUids = [...new Set([...orderTechnicianUids, ...delegationTechnicianUids])];

            const namePromises = uniqueTechnicianUids.map(uid =>
                UserService.getUserProfile(uid).then(profile => ({
                    uid,
                    name: profile?.displayName || `Tech-${uid.slice(-6)}`
                }))
            );

            const technicianData = await Promise.all(namePromises);
            const nameMap = technicianData.reduce((acc, { uid, name }) => {
                acc[uid] = name;
                return acc;
            }, {} as Record<string, string>);

            setTechnicianNames(nameMap);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Error fetching orders');
        } finally {
            setLoading(false);
        }
    }, [user, currentImpersonation, userRole, availableDelegations]);

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Jobs</h1>
                    <p className="text-muted-foreground">
                        View and manage your assigned jobs
                    </p>
                </div>
            </div>

            {/* CONTENT START HERE */}
            {userRole === 'admin' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm font-medium whitespace-nowrap">Act as worker:</span>
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
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Select worker" />
                            </SelectTrigger>
                            <SelectContent>
                                <DelegationManagement />
                                <SelectItem value="__none__">None (act as self)</SelectItem>
                                {availableDelegations.map((delegation) => (
                                    <SelectItem key={delegation.id} value={delegation.id}>
                                        {getTechnicianName(delegation.workerUid)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {currentImpersonation && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            {currentImpersonation.permissions.map((badge, index) => {

                                if (badge === "take_jobs") {
                                    return (
                                        <Badge key={index} variant="default">
                                            <Hand className="w-3 h-3 mr-1" />
                                            {badge}
                                        </Badge>
                                    )
                                }

                                if (badge === "complete_jobs") {
                                    return (
                                        <Badge key={index} variant="default">
                                            <Check className="w-3 h-3 mr-1" />
                                            {badge}
                                        </Badge>
                                    )
                                }

                                if (badge === "update_job_status") {
                                    return (
                                        <Badge key={index} variant="default">
                                            <Workflow className="w-3 h-3 mr-1" />
                                            {badge}
                                        </Badge>
                                    )
                                }

                                if (badge === "view_worker_jobs") {
                                    return (
                                        <Badge key={index} variant="default">
                                            <Eye className="w-3 h-3 mr-1" />
                                            {badge}
                                        </Badge>
                                    )
                                }

                                return (
                                    <Badge key={index} variant="default">
                                        {badge}
                                    </Badge>
                                )
                            })}
                        </div>
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
                        <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm h-fit">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {order.status === "PENDING" && (
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                <Clock className="w-3 h-3 mr-1" />
                                                PENDING
                                            </Badge>
                                        )}
                                        {order.status === "IN PROGRESS" && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                <Wrench className="w-3 h-3 mr-1" />
                                                IN PROGRESS
                                            </Badge>
                                        )}
                                        {order.status === "COMPLETED" && (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                ✓ COMPLETED
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(-8)}</span>
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 mt-2">{order.service.toUpperCase()}</CardTitle>
                                {order.adminNotes && (
                                    <div className="relative">
                                        <QuoteIcon className="w-16 h-16 absolute inset-0 text-muted-foreground opacity-10" />
                                        <p className="relative text-sm text-muted-foreground">{order.adminNotes}</p>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 ">
                                        <div className="rounded-full bg-muted p-2">
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <span className="text-green-600 text-sm">RM {order.quotedPrice}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-muted p-2">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-black/60">{getTechnicianName(order.assignedTechnician)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-muted p-2">
                                            <Map className="w-4 h-4" />
                                        </div>
                                        <span className=" text-sm text-black/60">{order.address}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                {order.status === "PENDING" && canPerformAction("take_jobs") && (
                                    <Button
                                        onClick={() => takeJobHandler(order.id)}
                                        className="w-full"
                                        disabled={jobTakenLoading}
                                    >
                                        {jobTakenLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                                        {jobTakenLoading ? "Taking..." : currentImpersonation ? `Take Job as ${getTechnicianName(currentImpersonation.workerUid)}` : "Take Job"}
                                    </Button>
                                )}

                                {order.status === "IN PROGRESS" && canPerformAction("complete_jobs") && (
                                    <Button
                                        onClick={() => completeJobHandler(order)}
                                        className="w-full"
                                        disabled={jobCompletedLoading}
                                        variant="outline"
                                    >
                                        {jobCompletedLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                                        {jobCompletedLoading ? "Completing..." : currentImpersonation ? `Complete Job as ${getTechnicianName(currentImpersonation.workerUid)}` : "Mark Completed"}
                                    </Button>
                                )}

                                {/* Show admin action indicators */}
                                {(order as Order & { takenByAdmin?: string }).takenByAdmin && (
                                    <Button variant="secondary" className="text-xs w-full" disabled>
                                        Taken by admin: {getTechnicianName((order as Order & { takenByAdmin?: string }).takenByAdmin!)}
                                    </Button>
                                )}
                                {(order as Order & { completedByAdmin?: string }).completedByAdmin && (
                                    <Button variant="secondary" className="text-xs w-full" disabled>
                                        Completed by admin: {getTechnicianName((order as Order & { completedByAdmin?: string }).completedByAdmin!)}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 