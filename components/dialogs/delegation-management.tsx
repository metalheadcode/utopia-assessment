"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/app/context/auth-context";
import { UserService, DelegationService } from "@/lib/user-service";
import { UserProfile, DelegationPermission } from "@/types/global.d.types";
import { Settings, UserCheck, Trash2 } from "lucide-react";

export function DelegationManagement() {
    const { user, userRole, availableDelegations, refreshUserProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [workers, setWorkers] = useState<UserProfile[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<string>("");
    const [selectedPermissions, setSelectedPermissions] = useState<DelegationPermission[]>([]);
    const [loading, setLoading] = useState(false);

    const availablePermissions: { value: DelegationPermission; label: string; description: string }[] = [
        { value: "take_jobs", label: "Take Jobs", description: "Allow taking pending jobs" },
        { value: "complete_jobs", label: "Complete Jobs", description: "Allow completing in-progress jobs" },
        { value: "update_job_status", label: "Update Job Status", description: "Allow updating job status" },
        { value: "view_worker_jobs", label: "View Worker Jobs", description: "Allow viewing worker's jobs" },
    ];

    useEffect(() => {
        if (isOpen && userRole === 'admin') {
            loadWorkers();
        }
    }, [isOpen, userRole]);

    const loadWorkers = async () => {
        try {
            const allWorkers = await UserService.getAllWorkers();
            setWorkers(allWorkers);
        } catch (error) {
            console.error("Error loading workers:", error);
            toast.error("Failed to load workers");
        }
    };

    const handleCreateDelegation = async () => {
        if (!user || !selectedWorker || selectedPermissions.length === 0) {
            toast.error("Please select a worker and at least one permission");
            return;
        }

        setLoading(true);
        try {
            await DelegationService.createDelegation(
                user.uid,
                selectedWorker,
                selectedPermissions
            );

            toast.success("Delegation created successfully");
            setSelectedWorker("");
            setSelectedPermissions([]);
            await refreshUserProfile(); // Refresh to get new delegations
        } catch (error) {
            console.error("Error creating delegation:", error);
            toast.error("Failed to create delegation");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    const handleRevokeDelegation = async (delegationId: string) => {
        if (!user) return;

        try {
            await DelegationService.revokeDelegation(user.uid, delegationId);
            toast.success("Delegation revoked successfully");
            await refreshUserProfile(); // Refresh to update delegations
        } catch (error) {
            console.error("Error revoking delegation:", error);
            toast.error("Failed to revoke delegation");
        } finally {
            setIsOpen(false);
        }
    };

    const handlePermissionChange = (permission: DelegationPermission, checked: boolean) => {
        if (checked) {
            setSelectedPermissions(prev => [...prev, permission]);
        } else {
            setSelectedPermissions(prev => prev.filter(p => p !== permission));
        }
    };

    if (userRole !== 'admin') {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Delegations
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Worker Delegation Management</DialogTitle>
                    <DialogDescription>
                        Set up permissions to act on behalf of workers. This allows you to take and complete jobs as if you were the worker.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Create New Delegation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Create New Delegation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Select Worker</label>
                                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a worker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workers.map((worker) => (
                                            <SelectItem key={worker.uid} value={worker.uid}>
                                                {worker.displayName} ({worker.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Permissions</label>
                                <div className="space-y-2">
                                    {availablePermissions.map((permission) => (
                                        <div key={permission.value} className="flex items-start space-x-2">
                                            <Checkbox
                                                id={permission.value}
                                                checked={selectedPermissions.includes(permission.value)}
                                                onCheckedChange={(checked) =>
                                                    handlePermissionChange(permission.value, checked as boolean)
                                                }
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor={permission.value}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {permission.label}
                                                </label>
                                                <p className="text-xs text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={handleCreateDelegation}
                                disabled={loading || !selectedWorker || selectedPermissions.length === 0}
                                className="w-full"
                            >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Create Delegation
                            </Button>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Active Delegations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Active Delegations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {availableDelegations.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No active delegations. Create one above to start acting on behalf of workers.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {availableDelegations.map((delegation) => (
                                        <div key={delegation.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    Worker: {delegation.workerUid}
                                                </div>
                                                <div className="flex gap-1 flex-wrap">
                                                    {delegation.permissions.map((permission) => (
                                                        <Badge key={permission} variant="secondary" className="text-xs">
                                                            {availablePermissions.find(p => p.value === permission)?.label || permission}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Created: {delegation.createdAt.toLocaleDateString()}
                                                    {delegation.expiresAt && (
                                                        <span> • Expires: {delegation.expiresAt.toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRevokeDelegation(delegation.id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Revoke
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}