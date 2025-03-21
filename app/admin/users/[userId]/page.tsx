import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import EditUserForm from "@/components/admin/EditUserForm";

interface EditUserPageProps {
  params: {
    userId: string;
  };
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
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

  // Get the user to edit
  const clerk = await clerkClient();
  const userToEdit = await clerk.users.getUser(params.userId);

  if (!userToEdit) {
    // User not found
    redirect('/admin/users');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit User</h1>
        <Link 
          href="/admin/users" 
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Users
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-16 w-16">
            {userToEdit.imageUrl ? (
              <Image 
                className="rounded-full" 
                src={userToEdit.imageUrl} 
                alt={`${userToEdit.firstName} ${userToEdit.lastName}`} 
                width={64}
                height={64}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-600">
                  {userToEdit.firstName?.[0] || userToEdit.emailAddresses[0]?.emailAddress?.[0] || '?'}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-medium text-gray-900">
              {userToEdit.firstName} {userToEdit.lastName}
            </h2>
            <p className="text-gray-500">
              {userToEdit.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
        
        <EditUserForm 
          userId={userToEdit.id} 
          currentRole={(userToEdit.publicMetadata as { role?: string })?.role || 'client'} 
        />
      </div>
    </div>
  );
};

export default EditUserPage;