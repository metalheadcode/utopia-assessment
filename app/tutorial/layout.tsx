import { Button } from "@/components/ui/button";
import { AirVent, Github } from "lucide-react";
import Link from "next/link";

export default function TutorialLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return <main className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
        {/* Navigation Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-stone-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 cursor-pointer" >
                        <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center">
                            <AirVent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-stone-900">SejookNamastey</h1>
                            <p className="text-sm text-stone-600">Sejuk Sejuk Service Sdn Bhd</p>
                        </div>
                    </Link>
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

        {children}

        {/* Footer */}
        <footer className="bg-stone-900 text-white py-12 px-4">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-stone-700 rounded-lg flex items-center justify-center p-2">
                                <AirVent className="w-6 h-6 text-white" />
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

}