'use client';

import { useUser } from '@clerk/nextjs';

/**
 * Component that displays the user's role from publicMetadata
 */
const UserRoleDisplay = () => {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null;
  }
  
  // Get the user's role from metadata
  const role = user.publicMetadata?.role as string || 'client';
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Account Information</h2>
      <div className="flex flex-col space-y-2">
        <div>
          <span className="text-gray-500">Email:</span> {user.primaryEmailAddress?.emailAddress}
        </div>
        <div>
          <span className="text-gray-500">Name:</span> {user.fullName}
        </div>
        <div>
          <span className="text-gray-500">Role:</span>{' '}
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserRoleDisplay;