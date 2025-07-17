import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, MapPin, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateOrder() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                        Tutorial Guide
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
                        How to Create a
                        <span className="text-stone-700 block">Service Order</span>
                    </h1>
                    <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
                        Follow this comprehensive guide to create and submit service orders for air conditioning maintenance and repairs in the SejookNamastey system.
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 px-4 bg-stone-50">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">Complete Guide in 5 Steps</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            Everything you need to know to successfully create and submit service orders for your customers
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
                                        <CardTitle className="text-stone-900">Navigate to Submit Order Page</CardTitle>
                                        <CardDescription>
                                            Access the order submission form from the admin dashboard
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            As an admin, start by navigating to the &quot;Submit Order&quot; page from your dashboard sidebar.
                                            This is where you&apos;ll create new service orders for customers who need air conditioning maintenance or repairs.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Admin Access Required</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        Only administrators can create new orders. Ensure you&apos;re logged in with admin privileges before proceeding.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/create-order/submit-order-button.webp"
                                            alt="Admin dashboard showing Submit Order navigation button"
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
                                        <CardTitle className="text-stone-900">Fill in Customer Information</CardTitle>
                                        <CardDescription>
                                            Enter the customer&apos;s contact details and service location information
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Complete the customer information form with accurate details. This includes the customer&apos;s name, email address, phone number, and the complete service address. All fields are required to ensure proper service delivery and communication.
                                        </p>

                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Users className="w-5 h-5 text-amber-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-amber-800 mb-1">Customer Account Creation</h4>
                                                    <p className="text-amber-700 text-sm">
                                                        If the customer doesn&apos;t exist in the system, a new customer account will be automatically created using the provided email address.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/create-order/complete-order-example.webp"
                                            alt="Order form showing customer information fields being filled out"
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
                                        <CardTitle className="text-stone-900">Specify Service Location</CardTitle>
                                        <CardDescription>
                                            Enter the complete address where the service will be performed
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Provide the exact service location using the Malaysia address form. This includes the street address, city, state, and postcode. The system uses Malaysia-specific postcode validation to ensure accurate location data.
                                        </p>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 mb-1">Location Accuracy</h4>
                                                    <p className="text-blue-700 text-sm">
                                                        Accurate address information is crucial for technicians to locate the service site and provide efficient service.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        {/* TODO: Add screenshot of address form */}
                                        <div className="bg-stone-50 rounded-lg p-4">
                                            <Image
                                                className="rounded-lg shadow-md w-full h-auto object-contain border"
                                                src="/images/create-order/malaysia-address.webp"
                                                alt="Address form with Malaysia postcode validation"
                                                width={800}
                                                height={500}
                                            />
                                        </div>
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
                                        <CardTitle className="text-stone-900">Add Service Details</CardTitle>
                                        <CardDescription>
                                            Describe the required service and set scheduling preferences
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Enter a detailed description of the air conditioning service required. This helps technicians understand the scope of work and come prepared with the right tools and parts.
                                        </p>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-purple-800 mb-1">Service Scheduling</h4>
                                                    <p className="text-purple-700 text-sm">
                                                        Include any scheduling preferences or urgency level to help prioritize the service request appropriately.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        {/* TODO: Add screenshot of service details form */}
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/create-order/service-details.webp"
                                            alt="Job status card showing completed state with successful service delivery"
                                            width={800}
                                            height={500}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 5 */}
                        <Card className="hover:shadow-lg transition-shadow bg-white">
                            <CardHeader>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-stone-800 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">5</span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-stone-900">Submit and Confirm Order</CardTitle>
                                        <CardDescription>
                                            Review all details and submit the service order for processing
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <p className="text-stone-600 leading-relaxed">
                                            Review all the entered information for accuracy before submitting. Once submitted, the order will be available for technicians to accept and complete. The customer will receive email notifications about the order status.
                                        </p>

                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-emerald-800 mb-1">Order Created Successfully</h4>
                                                    <p className="text-emerald-700 text-sm">
                                                        After submission, the order will appear in the orders list with &quot;Pending&quot; status, ready for technician assignment.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 rounded-lg p-4">
                                        {/* TODO: Add screenshot of order confirmation */}
                                        <Image
                                            className="rounded-lg shadow-md w-full h-auto object-contain border"
                                            src="/images/create-order/order-confirmation-card.webp"
                                            alt="Order confirmation card"
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