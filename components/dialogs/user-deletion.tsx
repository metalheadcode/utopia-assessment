import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Trash2, AlertTriangle, Skull, Target } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/auth-context";
import { Timestamp } from "firebase/firestore";

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'worker' | 'client';
    isActive: boolean;
    createdAt: Timestamp;
    lastLoginAt?: Timestamp;
}

interface UserDeletionDialogProps {
    user: UserProfile;
    onUserDeleted: () => void;
    getRoleBadgeVariant: (role: string) => "default" | "destructive" | "outline" | "secondary" | null | undefined;
}

export default function UserDeletionDialog({ user, onUserDeleted, getRoleBadgeVariant }: UserDeletionDialogProps) {
    const { user: currentUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [confirmationText, setConfirmationText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const expectedConfirmation = `DELETE ${user.email}`;

    const handleDeleteUser = async () => {
        if (!currentUser) return;

        if (confirmationText !== expectedConfirmation) {
            toast.error("Confirmation text does not match");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/delete-user-cascade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await currentUser.getIdToken()}`
                },
                body: JSON.stringify({
                    uid: user.uid,
                    reason: reason
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`User ${user.email} deleted successfully`);

                // Show deletion results
                const results = data.deletionResults;
                const summary = [];
                if (results.customerRecords > 0) summary.push(`${results.customerRecords} customer records`);
                if (results.orders > 0) summary.push(`${results.orders} orders`);
                if (results.assignedJobs > 0) summary.push(`${results.assignedJobs} job assignments`);
                if (results.delegations > 0) summary.push(`${results.delegations} delegations`);

                if (summary.length > 0) {
                    toast.info(`Also deleted: ${summary.join(', ')}`);
                }

                setOpen(false);
                setReason("");
                setConfirmationText("");
                setShowConfirmation(false);
                onUserDeleted();
            } else {
                toast.error(data.error || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason for deletion");
            return;
        }
        setShowConfirmation(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Skull className="w-5 h-5" />
                        Delete User Account
                    </DialogTitle>
                    <DialogDescription>
                        This action will permanently delete {user.displayName} ({user.email}) and all related data.
                    </DialogDescription>
                </DialogHeader>

                {!showConfirmation ? (
                    <div className="space-y-4">
                        {/* User Info */}
                        <div className="p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">{user.displayName}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                    {user.role}
                                </Badge>
                            </div>
                        </div>

                        {/* Warning */}
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="space-y-2">
                                    <div className="font-medium">This action will CASCADE DELETE:</div>
                                    <div className="text-sm space-y-1">
                                        <div>• User profile and authentication</div>
                                        <div>• All customer records (if client)</div>
                                        <div>• All submitted orders (pending/in-progress)</div>
                                        <div>• Job assignments (reassigned to pending)</div>
                                        <div>• Admin delegations (if admin)</div>
                                        <div>• Audit logs (anonymized for compliance)</div>
                                        <div>• Admin invitations sent by this user</div>
                                    </div>
                                    <div className="text-sm font-medium text-destructive">
                                        This action cannot be undone!
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Reason */}
                        <div className="space-y-2">
                            <Label>Reason for Deletion *</Label>
                            <Textarea
                                placeholder="Why is this user being deleted? (required for audit)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="destructive"
                                onClick={handleNext}
                                disabled={!reason.trim()}
                            >
                                <Target className="w-4 h-4 mr-2" />
                                Continue to Confirmation
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Final Confirmation */}
                        <Alert variant="destructive">
                            <Skull className="h-4 w-4" />
                            <AlertDescription>
                                <div className="space-y-2">
                                    <div className="font-medium">FINAL CONFIRMATION</div>
                                    <div className="text-sm">
                                        You are about to permanently delete <strong>{user.email}</strong> and all related data.
                                    </div>
                                    <div className="text-sm font-medium">
                                        This action is irreversible and will affect the entire system.
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>

                        {/* Confirmation Input */}
                        <div className="space-y-2">
                            <Label>
                                Type <code className="bg-muted px-1 py-0.5 rounded text-sm">{expectedConfirmation}</code> to confirm deletion:
                            </Label>
                            <Input
                                placeholder={expectedConfirmation}
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                className="font-mono"
                            />
                        </div>

                        {/* Summary */}
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm">
                                <div className="font-medium mb-1">Deletion reason:</div>
                                <div className="text-muted-foreground italic">{reason}</div>
                            </div>
                        </div>

                        {/* Final Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="destructive"
                                onClick={handleDeleteUser}
                                disabled={loading || confirmationText !== expectedConfirmation}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        DELETE USER FOREVER
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                disabled={loading}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}