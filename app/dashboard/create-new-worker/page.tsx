"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserPlus, Mail, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateNewWorkerPage() {
    const { user, userRole, sendLoginLink } = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: "",
        displayName: "",
        phoneNumber: "",
        department: "Field Service"
    });
    const [loading, setLoading] = useState(false);
    const [sendingLink, setSendingLink] = useState(false);

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

    const handleSendLoginLink = async () => {
        if (!formData.email) {
            toast.error("Please enter email address first");
            return;
        }

        setSendingLink(true);
        try {
            await sendLoginLink(formData.email);
            toast.success(`Login link sent to ${formData.email}!`);
        } catch (error) {
            console.error("Error sending login link:", error);
            toast.error("Failed to send login link");
        } finally {
            setSendingLink(false);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <UserPlus className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Create New Worker</h1>
                    <p className="text-muted-foreground">Add a new technician to your team</p>
                </div>
            </div>

            {/* Main Form */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Worker Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Worker Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                </ul>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Creating Worker..." : "Create Worker Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Send Login Link */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Send Login Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            After creating the worker account, send them a magic login link to access the dashboard.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-sm text-blue-900 mb-2">Login Instructions for Worker:</h4>
                            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Check email for magic login link</li>
                                <li>Click the link to sign in automatically</li>
                                <li>Access their jobs dashboard</li>
                                <li>Start taking and completing jobs</li>
                            </ol>
                        </div>

                        <Button 
                            onClick={handleSendLoginLink}
                            disabled={sendingLink || !formData.email}
                            variant="outline"
                            className="w-full"
                        >
                            {sendingLink ? "Sending..." : "Send Login Link"}
                        </Button>

                        <Separator />

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Next Steps:</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>1. Create worker account (left form)</li>
                                <li>2. Send login link (button above)</li>
                                <li>3. Go to Dashboard → Jobs → Manage Delegations</li>
                                <li>4. Set up permissions for the new worker</li>
                                <li>5. You can now act on their behalf!</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Ready to manage workers?</h3>
                            <p className="text-sm text-muted-foreground">
                                After creating workers, set up delegations to act on their behalf
                            </p>
                        </div>
                        <Link href="/dashboard/jobs">
                            <Button variant="outline">
                                Go to Jobs & Delegations
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}