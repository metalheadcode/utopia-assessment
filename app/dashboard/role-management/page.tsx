"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import {
    Users,
    Shield,
    Mail,
    Search,
    Crown,
    Wrench,
    User
} from "lucide-react";
import RoleManagementDialog from "@/components/dialogs/role-management";
import UserDeletionDialog from "@/components/dialogs/user-deletion";

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

export default function RoleManagementPage() {
    const { user, userRole } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [dependencies, setDependencies] = useState<UserDependencies | null>(null);
    const [loadingDependencies, setLoadingDependencies] = useState(false);
    const [newRole, setNewRole] = useState<string>("");
    const [reason, setReason] = useState("");
    const [forceChange, setForceChange] = useState(false);
    const [migrateCustomerData, setMigrateCustomerData] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [loadingInvite, setLoadingInvite] = useState(false);

    useEffect(() => {
        if (user && userRole === 'admin') {
            loadUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userRole]);

    // Only admins can access this page
    if (userRole !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-96">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Shield className="h-12 w-12 text-muted-foreground" />
                            <div>
                                <h3 className="font-semibold">Access Denied</h3>
                                <p className="text-sm text-muted-foreground">
                                    Admin privileges required to access role management.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const loadUsers = async () => {
        try {
            setLoading(true);
            // This would need a new API endpoint to list users
            const response = await fetch('/api/list-users', {
                headers: {
                    'Authorization': `Bearer ${await user?.getIdToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const checkUserDependencies = async (targetUser: UserProfile) => {
        try {
            setLoadingDependencies(true);
            const response = await fetch('/api/check-user-dependencies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user?.getIdToken()}`
                },
                body: JSON.stringify({ uid: targetUser.uid })
            });

            if (response.ok) {
                const data = await response.json();
                setDependencies(data.dependencies);
            } else {
                toast.error('Failed to check user dependencies');
            }
        } catch (error) {
            console.error('Error checking dependencies:', error);
            toast.error('Failed to check user dependencies');
        } finally {
            setLoadingDependencies(false);
        }
    };

    const handleRoleChange = async () => {
        if (!selectedUser || !newRole) return;

        try {
            const response = await fetch('/api/update-user-role-safe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user?.getIdToken()}`
                },
                body: JSON.stringify({
                    uid: selectedUser.uid,
                    newRole,
                    options: {
                        reason,
                        forceChange,
                        migrateCustomerData
                    }
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`User role changed from ${data.previousRole} to ${data.newRole}`);
                setSelectedUser(null);
                setDependencies(null);
                setNewRole("");
                setReason("");
                setForceChange(false);
                setMigrateCustomerData(false);
                await loadUsers(); // Refresh user list
            } else {
                toast.error(data.error || 'Failed to change user role');
                if (data.details) {
                    data.details.forEach((detail: string) => {
                        toast.warning(detail);
                    });
                }
            }
        } catch (error) {
            console.error('Error changing role:', error);
            toast.error('Failed to change user role');
        }
    };

    const sendAdminInvitation = async () => {
        if (!inviteEmail) return;

        try {
            setLoadingInvite(true);
            const response = await fetch('/api/send-admin-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user?.getIdToken()}`
                },
                body: JSON.stringify({ email: inviteEmail })
            });

            if (response.ok) {
                toast.success('Admin invitation sent successfully');
                setInviteEmail("");
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast.error('Failed to send invitation');
        } finally {
            setLoadingInvite(false);
        }
    };



    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.displayName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Crown className="w-4 h-4" />;
            case 'worker': return <Wrench className="w-4 h-4" />;
            case 'client': return <User className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin': return 'destructive';
            case 'worker': return 'default';
            case 'client': return 'secondary';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Role Management</h1>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions
                    </p>
                </div>
            </div>

            {/* Admin Invitation Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Admin Invitation
                    </CardTitle>
                    <CardDescription>
                        Send invitation emails to new admins
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter email address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            type="email"
                        />
                        <Button onClick={sendAdminInvitation} disabled={loadingInvite || !inviteEmail}>
                            {loadingInvite ? 'Sending...' : 'Send Invitation'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by email or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Filter by Role</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="worker">Worker</SelectItem>
                                    <SelectItem value="client">Client</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Users ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No users found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user.uid} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="font-medium">{user.displayName}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </Badge>
                                        {!user.isActive && (
                                            <Badge variant="outline" className="text-red-600">
                                                Inactive
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <RoleManagementDialog
                                            user={user}
                                            checkUserDependencies={checkUserDependencies}
                                            setSelectedUser={setSelectedUser}
                                            selectedUser={selectedUser}
                                            setDependencies={setDependencies}
                                            dependencies={dependencies}
                                            loadingDependencies={loadingDependencies}
                                            newRole={newRole}
                                            setNewRole={setNewRole}
                                            reason={reason}
                                            setReason={setReason}
                                            forceChange={forceChange}
                                            setForceChange={setForceChange}
                                            migrateCustomerData={migrateCustomerData}
                                            setMigrateCustomerData={setMigrateCustomerData}
                                            handleRoleChange={handleRoleChange}
                                            getRoleBadgeVariant={getRoleBadgeVariant}
                                        />
                                        <UserDeletionDialog
                                            user={user}
                                            onUserDeleted={loadUsers}
                                            getRoleBadgeVariant={getRoleBadgeVariant}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}