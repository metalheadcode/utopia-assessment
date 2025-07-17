import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, AlertTriangle, Shield, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RequestAdmin() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                        Tutorial Guide
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
                        How to Request
                        <span className="text-stone-700 block">Admin Access</span>
                    </h1>
                    <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                        Follow this step-by-step guide to request and activate your administrator privileges for the SejookNamastey service management system.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 bg-stone-50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">Complete Guide in 4 Steps</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Everything you need to know to successfully request and activate your admin account
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
                                        <CardTitle className="text-stone-900">Submit Your Email Address</CardTitle>
                                        <CardDescription>
                                            Provide your legitimate email address to receive the admin invitation
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            To begin the admin access request process,I locate the input form at the <Link className="text-blue-500 underline" target="_blank" href="/#cta">bottom of the landing page</Link>. You&apos;ll need to provide your legitimate email address.
                                            This email address will be used to send your administrative invitation and will serve as your login credentials.
                                        </p>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Important Note</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        Make sure to check your spam or junk folder if you don&apos;t see the invitation in your inbox.
                                                        Email filters sometimes catch automated invitations.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/request-admin/insert-email.png"
                                            alt="Email submission form interface"
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
                                        <CardTitle className="text-stone-900">Check Your Email for Invitation</CardTitle>
                                        <CardDescription>
                                            You&apos;ll receive an administrative invitation email with a secure activation link
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            After submitting your email address, you&apos;ll receive an administrative invitation email.
                                            The email will contain a secure link to activate your admin privileges.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Email Details</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        The invitation email will arrive from the SejookNamastey system.
                                                        Look for the subject line containing &quot;Admin Invitation&quot; or similar.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/request-admin/email-admin-invite.png"
                                            alt="Sample admin invitation email"
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
                                        <CardTitle className="text-stone-900">Accept the Invitation</CardTitle>
                                        <CardDescription>
                                            Click the link to begin the account activation process
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Click the secure link in your invitation email to begin the acceptance process.
                                            You&apos;ll be redirected to a confirmation page where you can activate your admin access.
                                        </p>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Security Notice</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        After accepting the invitation, you&apos;ll receive a second email for secure login.
                                                        This two-step process ensures your account security.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/request-admin/accept-invite.png"
                                            alt="Admin invitation acceptance page"
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
                                        <CardTitle className="text-stone-900">Access the Admin Portal</CardTitle>
                                        <CardDescription>
                                            Complete the login process and start managing the system
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Congratulations! After completing the authentication process, you&apos;ll be redirected to the admin dashboard.
                                            You can now access all administrative features, including order management and system controls.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Next Steps</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        Navigate to the &quot;Submit Order&quot; page to begin managing service requests and orders.
                                                        Explore the dashboard to familiarize yourself with available tools.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/request-admin/auth-login.png"
                                            alt="Admin portal dashboard interface"
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
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-stone-200 mb-8 max-w-2xl mx-auto">
                        Follow these four simple steps to gain administrative access to the SejookNamastey service management system.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-3">
                            <UserPlus className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Email Submission</p>
                                <p className="text-stone-200 text-sm">Quick & Secure</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <Mail className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Email Invitation</p>
                                <p className="text-stone-200 text-sm">Automated Process</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <Shield className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Secure Activation</p>
                                <p className="text-stone-200 text-sm">Two-Step Verification</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-stone-200" />
                            <div className="text-left">
                                <p className="font-semibold">Full Access</p>
                                <p className="text-stone-200 text-sm">Admin Dashboard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Tutorial Section */}
            <section id="tutorial" className="py-16 px-4 bg-stone-900">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-50 mb-4">Another Tutorial</h2>
                        <p className="text-stone-200 max-w-2xl mx-auto">
                            Follow the tutorial to explore the system
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
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