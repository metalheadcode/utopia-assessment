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

    const { control, handleSubmit, reset, watch, formState: { errors } } = form;

    // Load workers on component mount
    useEffect(() => {
        loadWorkers();
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

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            if (!user) {
                throw new Error("You must be logged in to submit an order");
            }

            // Prepare order data for Firestore
            const orderData = {
                ...data,
                orderID: generateOrderId(),
                quotedPrice: parseFloat(data.quotedPrice),
                submittedBy: user.uid,
                submittedByEmail: user.email,
                status: "PENDING",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Add document to Firestore
            const ordersCollection = collection(db, "orders");
            const docRef = await addDoc(ordersCollection, orderData);

            // Reset form on success
            reset();

            // Show success message
            toast.success(`Order ${docRef.id} submitted successfully!`);

            router.push(`/dashboard/orders`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit order. Please try again.";
            setSubmitError(errorMessage);
            toast.error(errorMessage);
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const customerName = watch("customerName") || "N/A";
    const phone = watch("phone") || "N/A";
    const address = watch("address") || "N/A";
    const service = watch("service") || "N/A";
    const quotedPrice = watch("quotedPrice") || "N/A";
    const assignedTechnicianUid = watch("assignedTechnician") || "";
    const assignedTechnician = assignedTechnicianUid
        ? workers.find(w => w.uid === assignedTechnicianUid)?.displayName || "N/A"
        : "N/A";
    const adminNotes = watch("adminNotes") || "N/A";

    return (
        <div className="grid grid-cols-2 gap-4 items-start">
            <Card className="col-span-1 h-fit">
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

                                <FormField
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

                                <MalaysiaAddress
                                    control={control}
                                    name="address"
                                />
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
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    {...field}
                                                >
                                                    <option value="">Select a service type</option>
                                                    {serviceOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
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
                                                    <SelectTrigger>
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
                                                Technician assigned to this order
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
                                    onClick={() => reset()}
                                    disabled={isSubmitting}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="col-span-1 h-fit sticky top-5">
                <CardHeader>
                    <CardTitle>Order Preview</CardTitle>
                    <CardDescription>
                        Live preview of your order details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h3>
                            <div className="space-y-2 grid grid-cols-2 grid-rows-auto gap-2">
                                <div className="col-span-1">
                                    <Label className="text-xs text-muted-foreground">Name</Label>
                                    <p className="font-medium">{customerName}</p>
                                </div>
                                <div className="col-span-1">
                                    <Label className="text-xs text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-xs text-muted-foreground">Address</Label>
                                    <p className="font-medium">{address}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Details</h3>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Service</Label>
                                    <p className="font-medium">{service}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Quoted Price</Label>
                                    <p className="font-medium">{quotedPrice}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Assigned Technician</Label>
                                    <p className="font-medium">{assignedTechnician}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Admin Notes</Label>
                                    <p className="font-medium">{adminNotes}</p>
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
                    {/* ERROR END HERE  */}
                </CardContent>
            </Card>
        </div>
    );
}