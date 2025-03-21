import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
    return (
        <>
            <SignedIn>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
                    <p>Welcome to your seller dashboard. This content is only visible to authenticated sellers.</p>
                    
                    {/* Dashboard content goes here */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
                            <p>Your sales data will appear here.</p>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
                            <p>Your recent orders will appear here.</p>
                        </div>
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default Dashboard;