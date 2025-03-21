import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import React from "react";

const Markets = () => {
    return (
        <>
            <SignedIn>
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Markets</h1>
                    <p>Welcome to the markets page. This content is only visible to authenticated users.</p>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
};

export default Markets;