import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, AlertTriangle, Shield, Wrench, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RoleManagementTutorial() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                        Tutorial Guide
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
                        How to Manage
                        <span className="text-stone-700 block">User Roles</span>
                    </h1>
                    <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                        Learn how to convert clients to workers and manage user roles effectively in the SejookNamastey system.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 bg-stone-50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">Complete Guide in 4 Steps</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Everything you need to know to successfully convert clients to workers and manage user roles
                        </p>
                    </div>

                    <div className="grid gap-8">
                        {/* Step 1 */}
                        <Card className="hover:shadow-lg transition-shadow bg-white">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">1</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-stone-900">Navigate to Role Management</CardTitle>
                                        <CardDescription>
                                            Access the role management section from your admin dashboard
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            First, log in to your admin dashboard and navigate to the &quot;Role Management&quot; section.
                                            This page displays all users in the system with their current roles (Admin, Worker, or Client).
                                        </p>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 mb-1">Admin Access Required</h4>
                                                    <p className="text-blue-700 text-sm">
                                                        Only users with admin privileges can access the role management functionality.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/screenshots/role-management.webp"
                                            alt="Role management interface"
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2 */}
                        <Card className="hover:shadow-lg transition-shadow bg-white">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">2</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-stone-900">Find and Select the Client</CardTitle>
                                        <CardDescription>
                                            Use search and filters to locate the client you want to convert
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Use the search bar to find the specific client by email or name.
                                            You can also filter by role to show only clients.
                                            Each user displays their current role badge (Client, Worker, or Admin).
                                        </p>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <User className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Role Identification</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        Client roles are shown with a gray badge, Workers with blue, and Admins with red.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/role-management/filter.webp"
                                            alt="Filter exisiting emails"
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 3 */}
                        <Card className="hover:shadow-lg transition-shadow bg-white">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">3</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-stone-900">Open Role Management Dialog</CardTitle>
                                        <CardDescription>
                                            Click the &quot;Manage Role&quot; button to open the role management dialog
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4 md:sticky md:top-[100px] relative">
                                        <p className="text-stone-600 leading-relaxed">
                                            Click the &quot;Manage Role&quot; button next to the client you want to convert.
                                            This opens a dialog that analyzes the user&apos;s current dependencies and
                                            provides options for role conversion.
                                        </p>

                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-green-800 mb-1">Dependency Check</h4>
                                                    <p className="text-green-700 text-sm">
                                                        The system automatically checks for any orders or jobs that might be affected.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/role-management/manage-role-button.webp"
                                            alt="Manage role button"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/role-management/manage-role-dialogue.webp"
                                            alt="Manage role button"
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 4 */}
                        <Card className="hover:shadow-lg transition-shadow bg-white">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">4</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-stone-900">Convert Client to Worker</CardTitle>
                                        <CardDescription>
                                            Select Worker role and handle data migration if needed
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4 md:sticky md:top-[100px] relative">
                                        <p className="text-stone-600 leading-relaxed">
                                            Select &quot;Worker&quot; from the role dropdown and provide a reason for the change.
                                            If the client has existing orders, you can choose to migrate their customer data.
                                            Click &quot;Change Role&quot; to complete the conversion.
                                        </p>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Data Migration</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        Consider whether to migrate existing customer orders when converting to worker.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/role-management/manage-role-button.webp"
                                            alt="Manage role button"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/role-management/manage-role-dialogue.webp"
                                            alt="Manage role button"
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Summary Section */}
            <section className="py-16 px-4 bg-stone-800 text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Role Management Made Simple</h2>
                    <p className="text-stone-200 mb-8 max-w-2xl mx-auto">
                        Follow these four steps to effectively manage user roles and convert clients to workers in your system.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3">
                            <Shield className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Access Management</p>
                                <p className="text-stone-200 text-sm">Admin Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <Users className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Find Users</p>
                                <p className="text-stone-200 text-sm">Search & Filter</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <Wrench className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Role Dialog</p>
                                <p className="text-stone-200 text-sm">Dependency Check</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Convert Role</p>
                                <p className="text-stone-200 text-sm">Client to Worker</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutorial Section */}
            <section id="tutorial" className="py-16 px-4 bg-stone-900">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-50 mb-4">More Tutorials</h2>
                        <p className="text-stone-200 max-w-2xl mx-auto">
                            Explore other system features and learn how to use them effectively
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* REQUEST ADMIN ACCESS */}
                        <div className="bg-stone-800 p-6 rounded-xl shadow-sm space-y-4 h-fit">
                            <Image className="rounded-lg" src="/screenshots/admin-invitation.webp" alt="Admin invitation interface" width={1000} height={1000} />
                            <h3 className="text-lg font-semibold text-stone-300 mb-3">How to Request Admin Access</h3>
                            <p className="text-stone-400 text-sm">
                                In this tutorial, you will learn how to request admin access to the system.
                            </p>
                            <Link href="/tutorial/request-admin">
                                <Button variant="outline" className="w-full">
                                    View Tutorial
                                </Button>
                            </Link>
                        </div>

                        {/* CREATE ORDER */}
                        <div className="bg-stone-800 p-6 rounded-xl shadow-sm space-y-4 h-fit">
                            <Image className="rounded-lg" src="/screenshots/submit-new-order.webp" alt="Order submission form" width={1000} height={1000} />
                            <h3 className="text-lg font-semibold text-stone-300 mb-3">How to Create Order</h3>
                            <p className="text-stone-400 text-sm">
                                In this tutorial, you will learn how to create an order in the system.
                            </p>
                            <Link href="/tutorial/create-order">
                                <Button variant="outline" className="w-full">
                                    View Tutorial
                                </Button>
                            </Link>
                        </div>

                        {/* TAKE JOB */}
                        <div className="bg-stone-800 p-6 rounded-xl shadow-sm space-y-4 h-fit">
                            <Image className="rounded-lg" src="/screenshots/jobs-page.webp" alt="Job management interface" width={1000} height={1000} />
                            <h3 className="text-lg font-semibold text-stone-300 mb-3">How to Take Job</h3>
                            <p className="text-stone-400 text-sm">
                                In this tutorial, you will learn how to take a job in the system.
                            </p>
                            <Link href="/tutorial/take-job">
                                <Button variant="outline" className="w-full">
                                    View Tutorial
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}