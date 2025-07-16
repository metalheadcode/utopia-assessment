"use client"

import { Form, FormMessage, FormItem, FormDescription, FormControl, FormLabel, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/global.d.types";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import MalaysiaAddress from "@/components/forms/malaysia-address";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { db } from "@/firebase/root";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { generateOrderId } from "@/lib/orderId";
import { UserService } from "@/lib/user-service";
import Link from "next/link";
import Image from "next/image";

// Customer interface
interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    uid?: string;
    lastOrderDate?: Date | null;
    totalOrders?: number;
    isActive?: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}


interface OrderPreviewProps {
    customerName: string;
    phone: string;
    address: string;
    service: string;
    quotedPrice: string;
    assignedTechnician: string;
    adminNotes: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any;
}

// Enhanced validation schema
const formSchema = z.object({
    customerName: z.string().min(2, "Customer name must be at least 2 characters"),
    customerEmail: z.string().email("Please enter a valid email address"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    service: z.enum(["Aircond cleaning", "Aircond repair", "Aircond installation", "Aircond maintenance", "Other"] as const),
    quotedPrice: z.string()
        .min(1, "Quoted price is required")
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
    assignedTechnician: z.string().min(1, "Please assign a technician"),
    adminNotes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const serviceOptions = [
    "Aircond cleaning",
    "Aircond repair",
    "Aircond installation",
    "Aircond maintenance",
    "Other"
];

export default function SubmitOrderPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [workers, setWorkers] = useState<UserProfile[]>([]);
    const [loadingWorkers, setLoadingWorkers] = useState(true);

    // Customer state management
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<string>("new");
    const [searchTerm, setSearchTerm] = useState("");

    const { user } = useAuth();
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerEmail: "",
            phone: "+6",
            address: "",
            service: undefined,
            quotedPrice: "",
            assignedTechnician: "",
            adminNotes: "",
        }
    });

    const { control, handleSubmit, reset, watch, formState: { errors }, setError } = form;

    // Load workers and customers on component mount
    useEffect(() => {
        loadWorkers();
        loadCustomers();
    }, []);

    const loadWorkers = async () => {
        try {
            setLoadingWorkers(true);
            const allWorkers = await UserService.getAllWorkers();
            setWorkers(allWorkers);
        } catch (error) {
            console.error("Error loading workers:", error);
            toast.error("Failed to load workers. Please refresh the page.");
        } finally {
            setLoadingWorkers(false);
        }
    };

    const loadCustomers = async () => {
        try {
            setLoadingCustomers(true);
            const { getDocs, query, orderBy, limit } = await import('firebase/firestore');

            // Load recent customers first (last 50 for better performance)
            const customersQuery = query(
                collection(db, "customers"),
                orderBy("updatedAt", "desc"),
                limit(50)
            );

            const querySnapshot = await getDocs(customersQuery);
            const customerData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Customer[];

            setCustomers(customerData);
        } catch (error) {
            console.error("Error loading customers:", error);
            toast.error("Failed to load customers. Please refresh the page.");
        } finally {
            setLoadingCustomers(false);
        }
    };

    // Handle customer selection and auto-fill
    const handleCustomerSelection = (customerId: string) => {
        setSelectedCustomer(customerId);

        if (customerId === "new") {
            // Clear form for new customer
            form.setValue("customerName", "");
            form.setValue("customerEmail", "");
            form.setValue("phone", "+6");
            form.setValue("address", "");
        } else {
            // Find selected customer and auto-fill form
            const customer = customers.find(c => c.id === customerId);
            if (customer) {
                form.setValue("customerName", customer.name);
                form.setValue("customerEmail", customer.email);
                form.setValue("phone", customer.phone || "+6");
                form.setValue("address", customer.address || "");

                toast.success(`Customer ${customer.name} selected and form auto-filled!`);
            }
        }
    };

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const onSubmit = async (data: FormData) => {
        console.log(data, data.customerEmail);
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (!user) {
                throw new Error("You must be logged in to submit an order");
            }

            // Ensure we have all customer data (handle disabled field case)
            const customerEmail = data.customerEmail || form.getValues('customerEmail');
            const customerName = data.customerName || form.getValues('customerName');
            const customerPhone = data.phone || form.getValues('phone');
            const customerAddress = data.address || form.getValues('address');

            if (!customerEmail) {
                throw new Error("Customer email is required");
            }

            // Step 1: Check if customer already exists
            let customerId = null;
            let customerUid = null;

            // Check if customer already exists in customers collection
            const customersCollection = collection(db, "customers");
            const { getDocs, query, where } = await import('firebase/firestore');
            const existingCustomerQuery = query(customersCollection, where("email", "==", customerEmail));
            const existingCustomerSnapshot = await getDocs(existingCustomerQuery);

            if (!existingCustomerSnapshot.empty) {
                // Customer already exists, use existing record
                const existingCustomerDoc = existingCustomerSnapshot.docs[0];
                customerId = existingCustomerDoc.id;
                customerUid = existingCustomerDoc.data().uid;

                // Update customer data if needed
                const { updateDoc, doc } = await import('firebase/firestore');

                await updateDoc(doc(db, "customers", customerId), {
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                    updatedAt: serverTimestamp(),
                });

                toast.info("Existing customer updated with new information");
            } else {
                // Step 2: Create new customer user account with "client" role
                try {
                    const response = await fetch('/api/create-customer-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: customerEmail,
                            displayName: customerName,
                            phone: customerPhone,
                            address: customerAddress
                        })
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.error || 'Failed to create customer user');
                    }

                    customerUid = result.uid;
                    customerId = result.customerId;

                    // Send login link to customer
                    const emailResponse = await fetch('/api/send-customer-login-link', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: customerEmail,
                            customerName: customerName
                        })
                    });

                    const emailResult = await emailResponse.json();

                    if (!emailResponse.ok) {
                        console.error("Failed to send login link:", emailResult);
                        toast.warning(`Customer account created, but email sending failed: ${emailResult.error || 'Unknown error'}`);
                    } else {
                        toast.success("Customer account created and login link sent!");
                    }
                } catch (customerError) {
                    // If customer user creation fails, create customer record without Firebase Auth
                    console.warn("Customer user creation failed, creating customer record only:", customerError);

                    const customerData = {
                        name: customerName,
                        email: customerEmail,
                        phone: customerPhone,
                        address: customerAddress,
                        uid: null, // No Firebase Auth user created
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    };

                    const customerDocRef = await addDoc(customersCollection, customerData);
                    customerId = customerDocRef.id;

                    toast.warning("Customer record created (login capability will be added later)");
                }
            }

            // Step 3: Create order with customer reference
            const orderData = {
                customerName: customerName,
                customerEmail: customerEmail,
                phone: customerPhone,
                address: customerAddress,
                service: data.service,
                quotedPrice: parseFloat(data.quotedPrice),
                assignedTechnician: data.assignedTechnician,
                adminNotes: data.adminNotes,
                customerId: customerId,
                customerUid: customerUid, // Can be null if customer user creation failed
                orderID: generateOrderId(),
                submittedBy: user.uid,
                submittedByEmail: user.email,
                status: "PENDING",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Add order document to Firestore
            const ordersCollection = collection(db, "orders");
            const docRef = await addDoc(ordersCollection, orderData);

            // Reset form on success
            reset();
            setSelectedCustomer("new");
            setSearchTerm("");

            // Show success message
            toast.success(`Order ${docRef.id} submitted successfully!`);

            router.push(`/dashboard/jobs`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit order. Please try again.";
            setSubmitError(errorMessage);
            toast.error(errorMessage);
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submit New Order</h1>
                    <p className="text-muted-foreground">
                        Create a new service order for air conditioning services
                    </p>
                </div>
            </div>

            {/* CONTENT START HERE */}

            <div className="grid grid-cols-12 gap-4 items-start">
                <Card className="col-span-7 h-fit">
                    <CardHeader>
                        <CardTitle>Submit New Order</CardTitle>
                        <CardDescription>
                            Create a new service order for air conditioning services
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Customer Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Customer Information</h3>

                                    <Select
                                        value={selectedCustomer}
                                        onValueChange={handleCustomerSelection}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">✨ New Customer</SelectItem>
                                            {loadingCustomers ? (
                                                <SelectItem value="loading" disabled>
                                                    Loading customers...
                                                </SelectItem>
                                            ) : customers.length === 0 ? (
                                                <SelectItem value="no-customers" disabled>
                                                    No customers found
                                                </SelectItem>
                                            ) : (
                                                <>
                                                    {/* Search input */}
                                                    <div className="px-2 py-1 sticky top-0 bg-white border-b">
                                                        <input
                                                            type="text"
                                                            placeholder="Search customers..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    {/* Customer list */}
                                                    {filteredCustomers.length === 0 ? (
                                                        <SelectItem value="no-match" disabled>
                                                            No customers match your search
                                                        </SelectItem>
                                                    ) : (
                                                        filteredCustomers.map((customer) => (
                                                            <SelectItem key={customer.id} value={customer.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{customer.name}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {customer.email} • {customer.phone}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <FormField
                                        disabled={selectedCustomer !== "new"}
                                        control={control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Name
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter customer full name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Full name of the customer
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        disabled={selectedCustomer !== "new"}
                                        control={control}
                                        name="customerEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Email Address
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email address"
                                                        type="email"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            if (user?.email === e.target.value) {
                                                                toast.warning("You cannot use your own email address as a customer");
                                                                setError("customerEmail", {
                                                                    message: "You cannot use your own email address as a customer"
                                                                });
                                                                // DELETE THE VALUE
                                                                field.onChange("");
                                                            } else {
                                                                // CLEAR AN ERROR
                                                                delete errors.customerEmail;
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Service updates and notifications will be sent to this email address
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        disabled={selectedCustomer !== "new"}
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Phone Number
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+60123456789"
                                                        {...field}
                                                        type="tel"
                                                        pattern="^\+?[1-9]\d{0,15}$"
                                                        onKeyDown={(e) => {
                                                            // Allow: backspace, delete, tab, escape, enter, and navigation keys
                                                            if ([8, 9, 27, 13, 46, 37, 39].indexOf(e.keyCode) !== -1 ||
                                                                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                                                (e.keyCode === 65 && e.ctrlKey === true) ||
                                                                (e.keyCode === 67 && e.ctrlKey === true) ||
                                                                (e.keyCode === 86 && e.ctrlKey === true) ||
                                                                (e.keyCode === 88 && e.ctrlKey === true)) {
                                                                return;
                                                            }
                                                            // Allow: +, numbers, and some special characters
                                                            if ((e.keyCode >= 48 && e.keyCode <= 57) || // numbers
                                                                e.keyCode === 43 || // plus sign
                                                                e.keyCode === 45 || // minus sign
                                                                e.keyCode === 32) { // space
                                                                return;
                                                            }
                                                            // Prevent all other keys
                                                            e.preventDefault();
                                                        }}
                                                        onChange={(e) => {
                                                            // Remove any non-numeric characters except +, -, and spaces
                                                            const value = e.target.value.replace(/[^\d+\-\s]/g, '');
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Phone number for communication
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {selectedCustomer === "new" && <MalaysiaAddress
                                        control={control}
                                        name="address"
                                    />}
                                </div>

                                <Separator />

                                {/* Service Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Service Information</h3>

                                    <FormField
                                        control={control}
                                        name="service"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Service Type
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>

                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a service type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {serviceOptions.map((service) => (
                                                                <SelectItem key={service} value={service}>
                                                                    {service}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    Type of service required
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="quotedPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Quoted Price
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="0.00"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Price quoted to the customer
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                {/* Assignment Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Assignment Information</h3>

                                    <FormField
                                        control={control}
                                        name="assignedTechnician"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    Assigned Technician
                                                    <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        disabled={loadingWorkers}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a technician" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {loadingWorkers ? (
                                                                <SelectItem value="loading" disabled>
                                                                    Loading workers...
                                                                </SelectItem>
                                                            ) : workers.length === 0 ? (
                                                                <SelectItem value="no-workers" disabled>
                                                                    No workers available
                                                                </SelectItem>
                                                            ) : (
                                                                workers.map((worker) => (
                                                                    <SelectItem key={worker.uid} value={worker.uid}>
                                                                        {worker.displayName} ({worker.email})
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    If no technicians are available, please create a new technician <Link target="_blank" className="text-blue-500 underline" href="/dashboard/worker-list">here</Link>
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="adminNotes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Admin Notes</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Additional notes or special instructions"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Optional notes for internal reference
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Error Display */}
                                {submitError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-red-600 text-sm">{submitError}</p>
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit Order"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            reset();
                                            setSelectedCustomer("new");
                                            setSearchTerm("");
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <OrderPreview
                    customerName={watch("customerName")}
                    phone={watch("phone")}
                    address={watch("address")}
                    service={watch("service")}
                    quotedPrice={watch("quotedPrice")}
                    assignedTechnician={watch("assignedTechnician")
                        ? workers.find(w => w.uid === watch("assignedTechnician"))?.displayName || "N/A"
                        : "N/A"}
                    adminNotes={watch("adminNotes") || "N/A"}
                    errors={errors}
                />

            </div>
        </div>
    );
}


const OrderPreview = ({
    customerName,
    phone,
    address,
    service,
    quotedPrice,
    assignedTechnician,
    adminNotes,
    errors,
}: OrderPreviewProps) => {
    return (
        <div className="sticky top-10 col-span-5 rounded-xl overflow-hidden shadow-lg ">
            <div className="h-[150px] w-full overflow-hidden relative">
                <Image src="/images/login.webp" alt="Order Preview" width={500} height={500} className="absolute -top-[80px] left-0 right-0 h-auto w-full object-cover" />
            </div>
            <div className="space-y-4 p-4">
                <div>
                    <h3 className="text-xl font-bold text-muted-foreground mb-2">Order Summary</h3>
                    <p className="text-sm text-muted-foreground">
                        Please review the order details before submitting.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
                    <div className="space-y-2 grid grid-cols-2 grid-rows-auto gap-2">
                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground">Name</Label>
                            <p className="font-medium">{customerName || "N/A"}</p>
                        </div>
                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground">Phone</Label>
                            <p className="font-medium">{phone || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Address</Label>
                            <p className="font-medium">{address || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Details</h3>
                    <div className="space-y-2">
                        <div>
                            <Label className="text-xs text-muted-foreground">Service</Label>
                            <p className="font-medium">{service || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Quoted Price</Label>
                            <p className="font-medium">{quotedPrice || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground" >Assigned Technician</Label>
                            <p className="font-medium">{assignedTechnician || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Admin Notes</Label>
                            <p className="font-medium">{adminNotes || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {errors && Object.keys(errors).length > 0 &&
                <div className="space-y-2 mt-4">
                    {Object.keys(errors).map((key) => (
                        <Alert key={key} variant="destructive">
                            <Terminal />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {errors[key as keyof typeof errors]?.message}
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            }
        </div>
    )
}