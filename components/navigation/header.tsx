"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string || "client";

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">eMarket</Link>
      </div>
      
      <div className="flex items-center">
        <SignedOut>
          <Link href='/auth/signin' className="mr-4">Sign In</Link>
          <Link href='/auth/signup'>Sign Up</Link>
        </SignedOut>
        
        <SignedIn>
          {/* Navigation links based on user role */}
          {role === "admin" && (
            <div className="mr-4">
              <Link href='/admin/dashboard' className="mr-4">Admin Dashboard</Link>
              <Link href='/admin/users' className="mr-4">Manage Users</Link>
            </div>
          )}
          
          {role === "seller" && (
            <div className="mr-4">
              <Link href='/seller/dashboard' className="mr-4">Seller Dashboard</Link>
              <Link href='/seller/trending' className="mr-4">Trending</Link>
            </div>
          )}
          
          {role === "client" && (
            <div className="mr-4">
              <Link href='/client/markets' className="mr-4">Markets</Link>
              <Link href='/client/products' className="mr-4">Products</Link>
              <Link href='/client/promotions' className="mr-4">Promotions</Link>
            </div>
          )}
          
          <Link href='/profile' className="mr-4">Profile</Link>
          <span className="mr-4 px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}

export default Header