"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserService } from "@/lib/user-service";
import { UserProfile } from "@/types/global.d.types";
import { toast } from "sonner";
import { 
    Search, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    UserX, 
    UserCheck,
    RefreshCw,
    Users
} from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

export default function WorkerListPage() {
    const { userRole } = useAuth();
    const [workers, setWorkers] = useState<UserProfile[]>([]);
    const [filteredWorkers, setFilteredWorkers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadWorkers();
    }, []);

    useEffect(() => {
        // Filter workers based on search query
        const filtered = workers.filter(worker =>
            worker.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (worker.phoneNumber && worker.phoneNumber.includes(searchQuery))
        );
        setFilteredWorkers(filtered);
    }, [workers, searchQuery]);

    const loadWorkers = async () => {
        try {
            setLoading(true);
            const allWorkers = await UserService.getAllWorkers();
            setWorkers(allWorkers);
        } catch (error) {
            console.error("Error loading workers:", error);
            toast.error("Failed to load workers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadWorkers();
        setRefreshing(false);
        toast.success("Worker list refreshed");
    };

    const handleToggleStatus = async (worker: UserProfile) => {
        try {
            const newStatus = !worker.isActive;
            await UserService.updateUserProfile(worker.uid, { isActive: newStatus });
            
            // Update local state
            setWorkers(prev => prev.map(w => 
                w.uid === worker.uid ? { ...w, isActive: newStatus } : w
            ));
            
            toast.success(`Worker ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error("Error updating worker status:", error);
            toast.error("Failed to update worker status");
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    // Redirect if not admin
    if (userRole !== 'admin') {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Access Denied</h3>
                    <p className="text-muted-foreground">Only administrators can view the worker list.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Worker Management</h1>
                    <p className="text-muted-foreground">
                        Manage and view all technicians and workers in the system
                    </p>
                </div>
                <Button 
                    onClick={handleRefresh} 
                    disabled={refreshing}
                    variant="outline"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Workers ({filteredWorkers.length})
                            </CardTitle>
                            <CardDescription>
                                Complete list of all technicians and workers
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search workers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 w-64"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                            ))}
                        </div>
                    ) : filteredWorkers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {searchQuery ? 'No workers found' : 'No workers available'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery 
                                    ? 'Try adjusting your search terms' 
                                    : 'Create your first worker to get started'
                                }
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => window.location.href = '/dashboard/create-new-worker'}>
                                    Create Worker
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWorkers.map((worker) => (
                                    <TableRow key={worker.uid}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{worker.displayName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {worker.uid.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{worker.email}</TableCell>
                                        <TableCell>
                                            {worker.phoneNumber || (
                                                <span className="text-muted-foreground">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {worker.department || (
                                                <span className="text-muted-foreground">N/A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={worker.isActive ? "default" : "secondary"}
                                                className={worker.isActive ? "bg-green-100 text-green-800" : ""}
                                            >
                                                {worker.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(worker.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Worker
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(worker)}
                                                        className={worker.isActive ? "text-red-600" : "text-green-600"}
                                                    >
                                                        {worker.isActive ? (
                                                            <>
                                                                <UserX className="h-4 w-4 mr-2" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}