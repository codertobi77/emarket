import { SignedIn } from "@clerk/nextjs";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const UserManagement = async () => {
  // Get the current user
  const user = await currentUser();
  
  // If no user, redirect to sign-in
  if (!user) {
    redirect('/auth/signin');
  }
  
  // Check if user has admin role
  const userRole = (user.publicMetadata as { role?: string })?.role || 'client';
  
  // If user is not an admin, redirect to home
  if (userRole !== 'admin') {
    redirect('/');
  }

  // Define user type
  interface ClerkUser {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
    emailAddresses: Array<{ emailAddress?: string }>;
    createdAt: number;
    publicMetadata: Record<string, unknown>;
  }

  // Get all users
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({
    limit: 100,
  });

  return (
    <SignedIn>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <Link 
            href="/admin/dashboard" 
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.data.map((user: ClerkUser) => {
                const userRole = (user.publicMetadata as { role?: string })?.role || 'client';
                
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.imageUrl ? (
                            <Image 
                              className="rounded-full" 
                              src={user.imageUrl} 
                              alt={`${user.firstName} ${user.lastName}`} 
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-lg font-medium text-gray-600">
                                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.emailAddresses[0]?.emailAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          userRole === 'seller' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </SignedIn>
  );
};

export default UserManagement;