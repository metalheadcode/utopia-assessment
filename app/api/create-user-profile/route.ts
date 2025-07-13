import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/user-service";
import { UserRole } from "@/types/global.d.types";

export async function POST(request: NextRequest) {
    try {
        const { uid, email, displayName, role, additionalData } = await request.json();

        if (!uid || !email || !displayName || !role) {
            return NextResponse.json(
                { error: "Missing required fields: uid, email, displayName, role" },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles: UserRole[] = ["admin", "worker", "client"];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: "Invalid role. Must be one of: admin, worker, client" },
                { status: 400 }
            );
        }

        // Create user profile
        await UserService.createUserProfile(
            uid,
            email,
            displayName,
            role,
            additionalData
        );

        return NextResponse.json({ 
            success: true, 
            message: "User profile created successfully" 
        });

    } catch (error) {
        console.error("Error creating user profile:", error);
        return NextResponse.json(
            { error: "Failed to create user profile" },
            { status: 500 }
        );
    }
}