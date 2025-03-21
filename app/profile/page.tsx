import { UserProfile } from "@clerk/nextjs";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import UserRoleDisplay from "@/components/auth/UserRoleDisplay";

export default function ProfilePage() {
  return (
    <>
      <SignedIn>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
          <div className="max-w-4xl mx-auto">
            {/* Display user role information */}
            <UserRoleDisplay />
            
            {/* Clerk's UserProfile component */}
            <UserProfile
              path="/profile"
              routing="path"
              appearance={{
                elements: {
                  rootBox: {
                    boxShadow: "none",
                    width: "100%",
                  },
                  card: {
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    borderRadius: "0.5rem",
                  },
                },
              }}
            />
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}