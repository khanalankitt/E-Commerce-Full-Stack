import { redirect } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

async function getUser(): Promise<User | null> {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data;
}

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full mt-14">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-green-700 flex items-center justify-center text-white text-2xl font-semibold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Full Name</span>
              <span className="text-gray-800 font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Role</span>
              <span className="text-gray-800 font-medium capitalize">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member Since</span>
              <span className="text-gray-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
