import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { MoreHorizontal, AlertTriangle } from "lucide-react";
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

interface UserDependencies {
    currentRole: string;
    hasCustomerRecord: boolean;
    customerId: string | null;
    customerOrders: number;
    hasActiveJobs: boolean;
    pendingJobs: number;
    inProgressJobs: number;
    completedJobs: number;
    totalAssignedJobs: number;
    blockingFactors: string[];
    canChangeRole: boolean;
}

interface RoleManagementDialogProps {
    user: UserProfile;
    checkUserDependencies: (user: UserProfile) => void;
    setSelectedUser: (user: UserProfile | null) => void;
    selectedUser: UserProfile | null;
    setDependencies: (dependencies: UserDependencies | null) => void;
    dependencies: UserDependencies | null;
    loadingDependencies: boolean;
    newRole: string;
    setNewRole: (role: string) => void;
    reason: string;
    setReason: (reason: string) => void;
    forceChange: boolean;
    setForceChange: (forceChange: boolean) => void;
    migrateCustomerData: boolean;
    setMigrateCustomerData: (migrateCustomerData: boolean) => void;
    handleRoleChange: () => void;
    getRoleBadgeVariant: (role: string) => "default" | "destructive" | "outline" | "secondary" | null | undefined;
}


export default function RoleManagementDialog({ user, checkUserDependencies, setSelectedUser, selectedUser, setDependencies, dependencies, loadingDependencies, newRole, setNewRole, reason, setReason, forceChange, setForceChange, migrateCustomerData, setMigrateCustomerData, handleRoleChange, getRoleBadgeVariant }: RoleManagementDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setSelectedUser(user);
                        checkUserDependencies(user);
                    }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                    Manage Role
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Manage User Role</DialogTitle>
                    <DialogDescription>
                        Change role for {selectedUser?.displayName} ({selectedUser?.email})
                    </DialogDescription>
                </DialogHeader>

                {loadingDependencies ? (
                    <div className="py-8 text-center">Checking user dependencies...</div>
                ) : dependencies ? (
                    <div className="space-y-4">
                        {/* Current Status */}
                        <div>
                            <Label>Current Role</Label>
                            <div className="mt-1">
                                <Badge variant={getRoleBadgeVariant(dependencies.currentRole)}>
                                    {dependencies.currentRole}
                                </Badge>
                            </div>
                        </div>

                        {/* Dependencies Warning */}
                        {dependencies.blockingFactors.length > 0 && (
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="space-y-1">
                                        <div className="font-medium">Potential Issues:</div>
                                        {dependencies.blockingFactors.map((factor, index) => (
                                            <div key={index} className="text-sm">• {factor}</div>
                                        ))}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* New Role Selection */}
                        <div>
                            <Label>New Role</Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select new role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="worker">Worker</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reason */}
                        <div>
                            <Label>Reason for Change</Label>
                            <Textarea
                                placeholder="Why is this role change needed?"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            {dependencies.hasActiveJobs && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="force"
                                        checked={forceChange}
                                        onCheckedChange={(checked) => setForceChange(checked as boolean)}
                                    />
                                    <Label htmlFor="force" className="text-sm">
                                        Force change despite active jobs
                                    </Label>
                                </div>
                            )}

                            {dependencies.hasCustomerRecord && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="migrate"
                                        checked={migrateCustomerData}
                                        onCheckedChange={(checked) => setMigrateCustomerData(checked as boolean)}
                                    />
                                    <Label htmlFor="migrate" className="text-sm">
                                        Migrate customer data
                                    </Label>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                onClick={handleRoleChange}
                                disabled={!newRole || newRole === dependencies.currentRole}
                            >
                                Change Role
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedUser(null);
                                    setDependencies(null);
                                    setNewRole("");
                                    setReason("");
                                    setForceChange(false);
                                    setMigrateCustomerData(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}