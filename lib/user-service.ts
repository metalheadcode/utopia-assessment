import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    serverTimestamp,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { 
    userProfilesCollection, 
    delegationsCollection, 
    adminActionsCollection 
} from "@/firebase/root";
import { UserProfile, WorkerDelegation, AdminAction, UserRole, DelegationPermission, AdminActionType } from "@/types/global.d.types";

export class UserService {
    // Create user profile when user registers
    static async createUserProfile(
        uid: string, 
        email: string, 
        displayName: string, 
        role: UserRole,
        additionalData?: Partial<UserProfile>
    ): Promise<void> {
        const profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
            createdAt: unknown;
            updatedAt: unknown;
        } = {
            uid,
            email,
            displayName,
            role,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            ...additionalData
        };

        await setDoc(doc(userProfilesCollection, uid), profileData);
    }

    // Get user profile
    static async getUserProfile(uid: string): Promise<UserProfile | null> {
        const docSnap = await getDoc(doc(userProfilesCollection, uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        }
        return null;
    }

    // Update user profile
    static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
        const updateData = {
            ...updates,
            updatedAt: serverTimestamp()
        };
        await updateDoc(doc(userProfilesCollection, uid), updateData);
    }

    // Get all workers (for admin to see who they can supervise)
    static async getAllWorkers(): Promise<UserProfile[]> {
        const q = query(userProfilesCollection, where("role", "==", "worker"), where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        });
    }

    // Get workers supervised by an admin
    static async getSupervizedWorkers(adminUid: string): Promise<UserProfile[]> {
        const q = query(
            userProfilesCollection, 
            where("supervisor", "==", adminUid),
            where("isActive", "==", true)
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        });
    }
}

export class DelegationService {
    // Create delegation permission for admin to act as worker
    static async createDelegation(
        adminUid: string,
        workerUid: string,
        permissions: DelegationPermission[],
        expiresAt?: Date
    ): Promise<string> {
        const delegationId = `${adminUid}_${workerUid}`;
        const delegationData: Omit<WorkerDelegation, 'createdAt'> & { createdAt: unknown } = {
            id: delegationId,
            adminUid,
            workerUid,
            permissions,
            isActive: true,
            createdAt: serverTimestamp(),
            expiresAt,
            createdBy: adminUid
        };

        await setDoc(doc(delegationsCollection, delegationId), delegationData);
        
        // Log the admin action
        await AuditService.logAdminAction(
            adminUid,
            "delegation_created",
            "delegation",
            delegationId,
            { workerUid, permissions },
            workerUid
        );

        return delegationId;
    }

    // Check if admin has delegation to act as worker
    static async hasPermission(
        adminUid: string, 
        workerUid: string, 
        permission: DelegationPermission
    ): Promise<boolean> {
        const delegationId = `${adminUid}_${workerUid}`;
        const docSnap = await getDoc(doc(delegationsCollection, delegationId));
        
        if (!docSnap.exists()) return false;
        
        const delegation = docSnap.data() as WorkerDelegation;
        
        // Check if delegation is active and not expired
        if (!delegation.isActive) return false;
        if (delegation.expiresAt && delegation.expiresAt < new Date()) return false;
        
        return delegation.permissions.includes(permission);
    }

    // Get active delegations for an admin
    static async getAdminDelegations(adminUid: string): Promise<WorkerDelegation[]> {
        const q = query(
            delegationsCollection,
            where("adminUid", "==", adminUid),
            where("isActive", "==", true)
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                expiresAt: data.expiresAt?.toDate(),
            } as WorkerDelegation;
        });
    }

    // Revoke delegation
    static async revokeDelegation(adminUid: string, delegationId: string): Promise<void> {
        await updateDoc(doc(delegationsCollection, delegationId), {
            isActive: false,
            updatedAt: serverTimestamp()
        });

        // Log the admin action
        await AuditService.logAdminAction(
            adminUid,
            "delegation_revoked",
            "delegation",
            delegationId,
            { revoked: true }
        );
    }
}

export class AuditService {
    // Log admin actions for audit trail
    static async logAdminAction(
        adminUid: string,
        actionType: AdminActionType,
        entityType: 'job' | 'order' | 'user' | 'delegation',
        entityId: string,
        details: Record<string, unknown>,
        targetUid?: string
    ): Promise<void> {
        const actionId = `${adminUid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const actionData: Omit<AdminAction, 'timestamp'> & { timestamp: unknown } = {
            id: actionId,
            adminUid,
            targetUid,
            actionType,
            entityType,
            entityId,
            details,
            timestamp: serverTimestamp()
        };

        await setDoc(doc(adminActionsCollection, actionId), actionData);
    }

    // Get audit trail for an admin
    static async getAdminActions(adminUid: string, limit: number = 50): Promise<AdminAction[]> {
        const q = query(
            adminActionsCollection,
            where("adminUid", "==", adminUid)
        );
        const querySnapshot = await getDocs(q);
        
        const actions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                timestamp: data.timestamp?.toDate() || new Date(),
            } as AdminAction;
        });

        // Sort by timestamp descending and limit
        return actions
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
}