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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/app/context/auth-context"
import { Form, FormMessage, FormItem, FormDescription, FormControl, FormLabel, FormField } from "@/components/ui/form"
import { useState } from "react"
import { toast } from "sonner"

// Enhanced validation schema
const profileSchema = z.object({
    role: z.enum(["admin", "worker", "client", ""]),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function RoleDialog({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { userRole } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            role: userRole || "",
        }
    })

    const { control, handleSubmit, reset, setError } = form

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            if (data.role === "") {
                return setError("role", { message: "Role is required to continue using the system" })
            }


            if (!userRole) {
                return setError("role", { message: "Role is required to continue using the system" })
            }

            // Here you would typically update the user profile in Firebase
            // For now, we'll just log the data and show a success message
            console.log("Profile update data:", data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Show success message
            toast.success("Profile updated successfully!")

            // Reset form with new values
            reset(data)
            setIsOpen(false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile. Please try again."
            setSubmitError(errorMessage)
            toast.error(errorMessage)
            console.error("Profile update error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select Role</DialogTitle>
                    <DialogDescription>
                        Select your role to continue using the system.
                    </DialogDescription>
                </DialogHeader>

                <div className="col-span-1">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <FormField
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                Role
                                                <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                >
                                                    <option value="">Select a role</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="worker">Worker</option>
                                                    <option value="client">Client</option>
                                                </select>
                                            </FormControl>
                                            <FormDescription>
                                                This is mandatory to select a role to continue using the system.
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
