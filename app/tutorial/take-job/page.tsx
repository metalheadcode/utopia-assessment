import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Settings, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TakeJob() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                        Tutorial Guide
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
                        How to Take
                        <span className="text-stone-700 block">Job</span>
                    </h1>
                    <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                        Learn how administrators can take over jobs when workers are unavailable, and how to manage worker delegations effectively. This system allows flexible job assignment and team management for optimal service delivery.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 bg-stone-50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">Complete Guide in 4 Steps</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Everything you need to know to successfully manage job assignments and worker delegations as an administrator
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
                                        <CardTitle className="text-stone-900">Navigate to Jobs Page</CardTitle>
                                        <CardDescription>
                                            Access the jobs page to view available service orders and manage assignments
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Start by navigating to the Jobs page from your admin dashboard. Here you&apos;ll see all pending service orders that need to be assigned to technicians. As an admin, you can take over jobs when workers are unavailable, such as when they&apos;re sick or on leave.
                                        </p>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 mb-1">Admin Privileges</h4>
                                                    <p className="text-blue-700 text-sm">
                                                        Only administrators can manage job delegations and take over worker assignments. Ensure you have the necessary permissions before proceeding.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/take-job-as-admin.webp"
                                            alt="Jobs page showing pending service orders available for assignment"
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
                                        <CardTitle className="text-stone-900">Manage Worker Delegations</CardTitle>
                                        <CardDescription>
                                            Add workers to your delegation team for efficient job assignment and management
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start relative">
                                    <div className="space-y-4 relative md:sticky md:top-[100px] ">
                                        <p className="text-stone-600 leading-relaxed">
                                            To manage workers effectively, you need to add them to your delegation team. This system prevents overwhelming admins with hundreds of workers by allowing you to manage only your assigned team members.
                                        </p>
                                        <p className="text-stone-600 leading-relaxed">
                                            Other administrators may handle different workers, while you focus on managing your specific team of five to ten technicians. This delegation system ensures efficient team management and clear responsibility distribution.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Select Worker Tasks</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        Choose which tasks you want to delegate to each worker. You can select all tasks for easier management or specific ones based on the worker&apos;s expertise.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-stone-600 leading-relaxed">
                                            After adding workers to your delegation, you can view all team members under your management. If you need to remove a worker from your delegation, simply click the &quot;Revoke&quot; button. This action will remove them from your team but won&apos;t delete their worker account.
                                        </p>
                                    </div>



                                    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/add-worker-to-team.webp"
                                            alt="Worker delegation interface showing available workers to add"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/add-worker-to-team-2.webp"
                                            alt="Task selection interface for worker delegation"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/add-worker-to-team-3.webp"
                                            alt="Confirmation of worker successfully added to delegation team"
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
                                        <CardTitle className="text-stone-900">Assign Jobs to Workers</CardTitle>
                                        <CardDescription>
                                            Select workers from your delegation team to assign jobs and track progress
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start relative">
                                    <div className="space-y-4 relative md:sticky md:top-[100px]">
                                        <p className="text-stone-600 leading-relaxed">
                                            With workers in your delegation team, you can now assign jobs without system warnings. Select the appropriate worker from your delegation dropdown to assign the job. The system will track which administrator assigned the job.
                                        </p>
                                        <p className="text-stone-600 leading-relaxed">
                                            Job status follows three phases: &quot;Pending&quot; (awaiting assignment), &quot;In Progress&quot; (currently being worked on), and &quot;Completed&quot; (service finished). Once you assign a job, its status changes to &quot;In Progress&quot;. When the work is complete, update it to &quot;Completed&quot;.
                                        </p>
                                        <p className="text-stone-600 leading-relaxed">
                                            Upon job completion, the system automatically sends notification emails to the customer confirming service completion, and a congratulatory email to the assigned worker acknowledging their hard work.
                                        </p>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/system-warning.webp"
                                            alt="System warning displayed when attempting to assign job without proper delegation setup"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/status-card-pending.webp"
                                            alt="Job status card showing pending state awaiting worker assignment"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/status-card-in-progress.webp"
                                            alt="Job status card showing in progress state with assigned worker"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/status-card-completed.webp"
                                            alt="Job status card showing completed state with successful service delivery"
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
                                        <CardTitle className="text-stone-900">Monitor and Complete Jobs</CardTitle>
                                        <CardDescription>
                                            Track job progress and confirm completion for customer satisfaction
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Monitor job progress through the dashboard and communicate with your workers as needed. When a job is completed by the technician, update the status to &quot;Completed&quot; to trigger automatic notifications to the customer.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Completion Benefits</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        Marking jobs as completed triggers automatic customer notifications and worker recognition emails, maintaining professional communication.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Important Notes</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        Workers can also log in to their accounts to manage jobs directly, but their email must be registered by an admin first. Unregistered users will only have CLIENT access.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/customer-email-completed.webp"
                                            alt="Customer email completed"
                                            width={800}
                                            height={500}
                                        />
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/take-job/worker-email-completed.webp"
                                            alt="Worker email completed"
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
                    </div>
                </div>
            </section>
        </>
    );
}