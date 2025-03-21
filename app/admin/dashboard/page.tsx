import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const AdminDashboard = async () => {
  // Get the current user
  const user = await currentUser();
  
  // If no user, the SignedOut component will handle redirection
  if (!user) return null;
  
  // Check if user has admin role
  const userRole = (user.publicMetadata as { role?: string })?.role || 'client';
  
  // If user is not an admin, redirect to home
  if (userRole !== 'admin') {
    redirect('/');
  }

  return (
    <SignedIn>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">Manage users and their roles</p>
            <Link
              href="/admin/users" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Manage Users
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Site Statistics</h2>
            <p className="text-gray-600 mb-4">View site statistics and analytics</p>
            <a 
              href="/admin/statistics" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Statistics
            </a>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default AdminDashboard;