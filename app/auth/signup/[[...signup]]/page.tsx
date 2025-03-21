'use client';

import { SignUp } from '@clerk/nextjs';
import { useState } from 'react';

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState('client');

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full max-w-md">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          I want to join as a:
        </label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="client">Client (I want to shop)</option>
          <option value="seller">Seller (I want to sell products)</option>
        </select>
      </div>

      <SignUp 
        path="/auth/signup"
        routing="path"
        signInUrl="/auth/signin"
        unsafeMetadata={{
          role: selectedRole
        }}
      />
    </div>
  );
}