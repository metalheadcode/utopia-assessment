import { 
    doc, 
    updateDoc, 
    serverTimestamp,
    query,
    where,
    getDocs,
    getDoc
} from "firebase/firestore";
import { ordersCollection } from "@/firebase/root";
import { AuditService, DelegationService } from "./user-service";

export interface JobActionContext {
    adminUid?: string;      // If admin is performing action
    workerUid: string;      // The worker being acted for
    isImpersonation: boolean;
}

export class JobService {
    // Take a job (either as worker or admin acting as worker)
    static async takeJob(
        orderId: string, 
        context: JobActionContext
    ): Promise<void> {
        const { adminUid, workerUid, isImpersonation } = context;

        // If impersonation, verify delegation permissions
        if (isImpersonation && adminUid) {
            const hasPermission = await DelegationService.hasPermission(
                adminUid, 
                workerUid, 
                "take_jobs"
            );
            if (!hasPermission) {
                throw new Error("Admin does not have permission to take jobs for this worker");
            }
        }

        // Update order status
        const orderRef = doc(ordersCollection, orderId);
        await updateDoc(orderRef, {
            status: "IN PROGRESS",
            takenAt: serverTimestamp(),
            takenBy: workerUid,
            ...(isImpersonation && { takenByAdmin: adminUid })
        });

        // Log admin action if impersonation
        if (isImpersonation && adminUid) {
            await AuditService.logAdminAction(
                adminUid,
                "job_taken_as_worker",
                "job",
                orderId,
                { workerUid, action: "take_job" },
                workerUid
            );
        }
    }

    // Complete a job (either as worker or admin acting as worker)
    static async completeJob(
        orderId: string, 
        context: JobActionContext
    ): Promise<void> {
        const { adminUid, workerUid, isImpersonation } = context;

        // If impersonation, verify delegation permissions
        if (isImpersonation && adminUid) {
            const hasPermission = await DelegationService.hasPermission(
                adminUid, 
                workerUid, 
                "complete_jobs"
            );
            if (!hasPermission) {
                throw new Error("Admin does not have permission to complete jobs for this worker");
            }
        }

        // Update order status
        const orderRef = doc(ordersCollection, orderId);
        await updateDoc(orderRef, {
            status: "COMPLETED",
            completedAt: serverTimestamp(),
            completedBy: workerUid,
            ...(isImpersonation && { completedByAdmin: adminUid })
        });

        // Log admin action if impersonation
        if (isImpersonation && adminUid) {
            await AuditService.logAdminAction(
                adminUid,
                "job_completed_as_worker",
                "job",
                orderId,
                { workerUid, action: "complete_job" },
                workerUid
            );
        }
    }

    // Get jobs for a worker (including jobs that can be taken)
    static async getWorkerJobs(workerUid: string) {
        const assignedJobsQuery = query(
            ordersCollection,
            where("submittedBy", "==", workerUid)
        );
        
        const querySnapshot = await getDocs(assignedJobsQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Get all available jobs (for admin to see what workers can take)
    static async getAllJobs() {
        const querySnapshot = await getDocs(ordersCollection);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Get job details
    static async getJobDetails(orderId: string) {
        const docSnap = await getDoc(doc(ordersCollection, orderId));
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
        }
        return null;
    }

    // Helper to determine if user can perform action on job
    static canPerformJobAction(
        action: 'take' | 'complete',
        jobStatus: string,
        userRole: string,
        isImpersonating: boolean = false
    ): boolean {
        switch (action) {
            case 'take':
                return jobStatus === 'PENDING' && (userRole === 'worker' || (userRole === 'admin' && isImpersonating));
            case 'complete':
                return jobStatus === 'IN PROGRESS' && (userRole === 'worker' || (userRole === 'admin' && isImpersonating));
            default:
                return false;
        }
    }
}