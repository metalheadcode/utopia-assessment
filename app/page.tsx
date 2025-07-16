import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, Clock, Shield, Users, Star, Code, Database, Zap, Github, ExternalLink, Award, Eye, Settings, UserPlus, AirVent } from "lucide-react";
import { ClickableImage } from "@/components/ui/clickable-image";
import AdminInvitationForm from "@/components/admin-invitation-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-stone-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center">
                <AirVent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900">SejookNamastey</h1>
                <p className="text-sm text-stone-600">Sejuk Sejuk Service Sdn Bhd</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/metalheadcode/utopia-assessment" className="flex items-center space-x-2 text-stone-600 hover:text-stone-800">
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <Link href="/login">
                <Button>Live Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
            Assessment Portfolio Showcase
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6">
            Full-Stack Service
            <span className="text-stone-700 block">Management System</span>
          </h1>
          <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Complete assessment solution built with Next.js, TypeScript, and Firebase.
            Features admin portal, technician management, notifications, and analytics dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Demo
              </Button>
            </Link>
            <a href="https://github.com/metalheadcode/utopia-assessment" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              Module 1: Admin Portal
            </Badge>
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              Module 2: Technician Portal
            </Badge>
            <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50">
              <CheckCircle className="w-3 h-3 mr-1" />
              Module 3: Notifications
            </Badge>
            <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
              <Award className="w-3 h-3 mr-1" />
              Bonus: Analytics Dashboard
            </Badge>
          </div>
        </div>
      </section>

      {/* Assessment Modules Section */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Assessment Modules Completed</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              All required modules plus bonus features implemented with modern technologies and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-emerald-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-800">Module 1: Admin Portal</CardTitle>
                <CardDescription>
                  Order submission and technician assignment system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• Order creation & management</li>
                  <li>• Technician assignment</li>
                  <li>• Customer management</li>
                  <li>• Role-based access control</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-stone-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-stone-600" />
                </div>
                <CardTitle className="text-stone-800">Module 2: Technician Portal</CardTitle>
                <CardDescription>
                  Service job management and completion tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• Job list with status tracking</li>
                  <li>• Job assignment & delegation</li>
                  <li>• Mobile-responsive interface</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-amber-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-amber-800">Module 3: Notifications</CardTitle>
                <CardDescription>
                  WhatsApp and email integration for job updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• WhatsApp notifications</li>
                  <li>• Email alerts (Resend)</li>
                  <li>• Real-time triggers</li>
                  <li>• Customer notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-orange-200 bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-800">Bonus: Analytics Dashboard</CardTitle>
                <CardDescription>
                  KPI tracking and performance analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• Performance charts (Recharts)</li>
                  <li>• Worker analytics</li>
                  <li>• Job distribution metrics</li>
                  <li>• Role-based dashboards</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Technology Stack</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Modern, production-ready technologies used to build a scalable and maintainable system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Next.js 15 + TypeScript</h3>
              <p className="text-stone-600 text-sm">App Router, server components, and strict type safety</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Firebase Suite</h3>
              <p className="text-stone-600 text-sm">Authentication, Firestore, and real-time updates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-stone-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Tailwind + shadcn/ui</h3>
              <p className="text-stone-600 text-sm">Modern styling with reusable component library</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">React Hook Form + Zod</h3>
              <p className="text-stone-600 text-sm">Type-safe form validation and error handling</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Email + WhatsApp</h3>
              <p className="text-stone-600 text-sm">Resend for emails, WhatsApp API for notifications</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Recharts Analytics</h3>
              <p className="text-stone-600 text-sm">Interactive charts and performance dashboards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Feature Showcase</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Explore the key features and interfaces built for this assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <UserPlus className="w-5 h-5 text-stone-600" />
                  <CardTitle className="text-lg">Admin Invitation System</CardTitle>
                </div>
                <CardDescription>
                  Secure email-based admin invitations with role assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/admin-invitation.webp"
                    alt="Admin invitation interface"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Email-based authentication</li>
                  <li>• Secure one-time login links</li>
                  <li>• Role-based access control</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
                </div>
                <CardDescription>
                  Real-time statistics and performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/dashboard.webp"
                    alt="Admin invitation interface"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Performance charts (Recharts)</li>
                  <li>• Real-time statistics</li>
                  <li>• Role-based dashboards</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-lg">Role Management</CardTitle>
                </div>
                <CardDescription>
                  Advanced user role and permission management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/role-management.webp"
                    alt="Role management interface"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Fine-grained access control</li>
                  <li>• Dependency checking</li>
                  <li>• Audit logging</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-stone-600" />
                  <CardTitle className="text-lg">Order Management</CardTitle>
                </div>
                <CardDescription>
                  Streamlined order creation and worker assignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/submit-new-order.webp"
                    alt="Order submission form"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Form validation with Zod</li>
                  <li>• Worker assignment</li>
                  <li>• Customer integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Worker Management</CardTitle>
                </div>
                <CardDescription>
                  Comprehensive technician profile and assignment system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/worker-management.webp"
                    alt="Worker management interface"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Worker profiles</li>
                  <li>• Assignment tracking</li>
                  <li>• Performance monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white border-stone-200">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Job Management</CardTitle>
                </div>
                <CardDescription>
                  Mobile-optimized job tracking and delegation system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <ClickableImage
                    src="/screenshots/jobs-page.webp"
                    alt="Job management interface"
                    width={1000}
                    height={1000}
                  />
                </div>
                <p className="text-[8px] text-stone-600 text-center italic my-2">Scroll up within the frame to zoom in and down to zoom out</p>
                <ul className="space-y-1 text-sm text-stone-600">
                  <li>• Job status tracking</li>
                  <li>• Delegation capabilities</li>
                  <li>• Mobile-responsive design</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">System Architecture</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Modern, scalable architecture designed for real-world business operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Frontend Architecture</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• <strong>Next.js 15</strong> with App Router for server-side rendering</li>
                  <li>• <strong>TypeScript</strong> for type safety and better DX</li>
                  <li>• <strong>Tailwind CSS</strong> with shadcn/ui components</li>
                  <li>• <strong>React Hook Form + Zod</strong> for form validation</li>
                  <li>• <strong>Responsive design</strong> for mobile and desktop</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Backend Services</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• <strong>Firebase Authentication</strong> with custom claims</li>
                  <li>• <strong>Firestore Database</strong> for real-time data</li>
                  <li>• <strong>API Routes</strong> for server-side operations</li>
                  <li>• <strong>Email Integration</strong> with Resend</li>
                  <li>• <strong>WhatsApp API</strong> for notifications</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Key Features</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• <strong>Role-based Access Control</strong> (Admin, Worker, Customer)</li>
                  <li>• <strong>Real-time Updates</strong> with Firestore listeners</li>
                  <li>• <strong>Email Notifications</strong> with professional templates</li>
                  <li>• <strong>Analytics Dashboard</strong> with Recharts</li>
                  <li>• <strong>Audit Logging</strong> for compliance</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-stone-900 mb-3">Security & Performance</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• <strong>Firebase Security Rules</strong> for data protection</li>
                  <li>• <strong>Server-side Validation</strong> with Zod schemas</li>
                  <li>• <strong>Optimized Images</strong> with Next.js Image component</li>
                  <li>• <strong>Production Ready</strong> with proper error handling</li>
                  <li>• <strong>Mobile Responsive</strong> design patterns</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Workflow Implementation</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Admin creates order</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Worker receives & completes job</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>System sends notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Dashboard updates KPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-stone-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore the System?</h2>
          <p className="text-stone-200 mb-8 max-w-2xl mx-auto">
            Experience the full assessment solution. Generate an admin invitation to access all features and explore the complete system.
          </p>

          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </Button>
              </Link>
              <a href="https://github.com/metalheadcode/utopia-assessment" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-stone-800">
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </Button>
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-white mb-4">
                <h3 className="text-lg font-semibold mb-2">Generate Admin Access</h3>
                <p className="text-stone-200 text-sm">Get instant admin credentials to explore all features</p>
              </div>
              <AdminInvitationForm />
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-stone-200" />
              <div className="text-left">
                <p className="font-semibold">All Modules</p>
                <p className="text-stone-200">3 Core + Bonus Features</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Code className="w-5 h-5 text-stone-200" />
              <div className="text-left">
                <p className="font-semibold">Modern Stack</p>
                <p className="text-stone-200">Next.js 15 + TypeScript</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Github className="w-5 h-5 text-stone-200" />
              <div className="text-left">
                <p className="font-semibold">Open Source</p>
                <p className="text-stone-200">Available on GitHub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-stone-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-bold">Assessment Portfolio</h3>
                  <p className="text-sm text-stone-400">Full-Stack Developer Showcase</p>
                </div>
              </div>
              <p className="text-stone-400 text-sm">
                Complete service management system demonstrating modern web development skills and best practices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Technologies</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>Next.js 15 + TypeScript</li>
                <li>Firebase + Firestore</li>
                <li>Tailwind CSS + shadcn/ui</li>
                <li>React Hook Form + Zod</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>Admin Portal</li>
                <li>Worker Management</li>
                <li>Notification System</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Developer</h4>
              <div className="space-y-2 text-sm text-stone-400">
                <p>@metalheadcode</p>
                <a href="https://github.com/metalheadcode" className="text-amber-400 hover:text-amber-300">GitHub Profile</a>
                <a href="https://github.com/metalheadcode/utopia-assessment" className="text-amber-400 hover:text-amber-300 block">View Repository</a>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-400">
            <p>&copy; 2024 Assessment Portfolio by @metalheadcode. Built for evaluation purposes.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}