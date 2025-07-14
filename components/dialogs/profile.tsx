import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/app/context/auth-context"
import { Form, FormMessage, FormItem, FormDescription, FormControl, FormLabel, FormField } from "@/components/ui/form"
import { useState } from "react"
import { toast } from "sonner"
import { UserService } from "@/lib/user-service"

// Enhanced validation schema
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
        .optional()
        .or(z.literal("")),
    email: z.string().email("Please enter a valid email address")
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { user, refreshUserProfile } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.displayName || "",
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
        }
    })

    const { control, handleSubmit, reset } = form

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            if (!user) {
                throw new Error("You must be logged in to update your profile")
            }

            // Update Firebase Auth profile
            const { updateProfile } = await import('firebase/auth')
            await updateProfile(user, {
                displayName: data.name
            })

            // Update Firestore user profile
            await UserService.updateUserProfile(user.uid, {
                displayName: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber || ""
            })

            // Refresh user profile in context
            await refreshUserProfile()

            toast.success("Profile updated successfully!")
            reset(data)
            setIsOpen(false)
        } catch (error) {
            const errorMessage = error instanceof Error ?
                error.message : "Failed to update profile"
            setSubmitError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="col-span-1">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Personal Information</h3>

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                Full Name
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your full name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your full name as it appears on your profile
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="email"
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
                                                Your primary email address
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="+60123456789"
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
                                                    {...field}
                                                    onChange={(e) => {
                                                        // Remove any non-numeric characters except +, -, and spaces
                                                        const value = e.target.value.replace(/[^\d+\-\s]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Your contact phone number
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
                            <DialogFooter className="flex gap-3 pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline" disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
