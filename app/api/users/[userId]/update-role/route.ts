import { NextRequest, NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get the current user
    const user = await currentUser();

    // Check if the user is authenticated and has admin role
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the user's role from metadata
    const role = user.publicMetadata.role;

    // Check if the user is an admin
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get the user ID from the URL params
    const { userId } = params;

    // Get the new role from the request body
    const { role: newRole } = await request.json();

    // Validate the new role
    if (!newRole || !["admin", "client", "seller"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin', 'client', or 'seller'" },
        { status: 400 }
      );
    }

    // Update the user's role in Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, {
      publicMetadata: { role: newRole },
    });

    return NextResponse.json(
      { message: "User role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}