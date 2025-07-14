"use client";
import { UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export function CreateWorkerDialog() {
    const { user, userRole, sendLoginLink } = useAuth();
    const router = useRouter();

    // Dialog state
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        phoneNumber: "",
        department: "Field Service"
    });

    // Redirect if not admin
    if (userRole !== 'admin') {
        router.push('/dashboard');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateWorker = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to create workers");
            return;
        }

        if (!formData.email || !formData.displayName) {
            toast.error("Email and display name are required");
            return;
        }

        setLoading(true);
        try {
            // Create worker using the new API endpoint
            const response = await fetch('/api/create-worker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    displayName: formData.displayName,
                    supervisor: user.uid, // Current admin becomes supervisor
                    phoneNumber: formData.phoneNumber,
                    department: formData.department
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create worker');
            }

            toast.success(`Worker account created successfully for ${formData.displayName}!`);
            toast.success(`Technician ID: ${result.technicianId}`);

            await handleSendLoginLink(formData.email);

            // Reset form
            setFormData({
                email: "",
                displayName: "",
                phoneNumber: "",
                department: "Field Service"
            });

        } catch (error) {
            console.error("Error creating worker:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create worker account");
        } finally {
            setLoading(false);
        }
    };

    const handleSendLoginLink = async (email: string) => {
        if (!email) {
            toast.error("Please enter email address first");
            return;
        }

        try {
            await sendLoginLink(email);
            toast.success(`Login link sent to ${email}!`);
        } catch (error) {
            console.error("Error sending login link:", error);
            toast.error("Failed to send login link");
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Worker
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Worker</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateWorker} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="worker@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Worker will use this email to log in
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="displayName">Full Name *</Label>
                        <Input
                            id="displayName"
                            name="displayName"
                            type="text"
                            placeholder="John Technician"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="+60123456789"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            name="department"
                            type="text"
                            value={formData.department}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Separator />

                    <div className="bg-muted p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">What happens when you create a worker:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Worker account is created with proper permissions</li>
                            <li>• You automatically become their supervisor</li>
                            <li>• They appear in your &quot;Manage Delegations&quot; list</li>
                            <li>• Auto-generated Technician ID assigned</li>
                            <li>• Worker will receive a secure login link via email (Note: Please check spam folder if not received)</li>
                        </ul>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Creating Worker..." : "Create Worker Account"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}