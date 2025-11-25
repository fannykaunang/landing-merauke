// // contexts/auth-context.tsx
// // ✅ FIXED: Proper error handling and null checks

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { useRouter, usePathname } from "next/navigation";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   name?: string;
//   created_at?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   refreshUser: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   const refreshUser = useCallback(async () => {
//     console.log("🔄 AuthContext: Refreshing user...");

//     try {
//       const response = await fetch("/api/auth/session", {
//         method: "GET",
//         credentials: "include",
//         cache: "no-store",
//       });

//       console.log("📡 Session API Response:", {
//         status: response.status,
//         ok: response.ok,
//       });

//       // ✅ CRITICAL FIX: Check if response is ok before parsing
//       if (!response.ok) {
//         console.log("❌ Session API returned error:", response.status);
//         setUser(null);
//         return;
//       }

//       const data = await response.json();
//       console.log("📦 Session API Data:", {
//         success: data?.success,
//         authenticated: data?.authenticated,
//         hasUser: !!data?.user,
//       });

//       // ✅ CRITICAL FIX: Robust null checks
//       if (
//         data &&
//         data.success === true &&
//         data.authenticated === true &&
//         data.user
//       ) {
//         console.log("✅ User authenticated:", data.user.email);
//         setUser(data.user);
//       } else {
//         console.log("❌ User not authenticated or invalid response");
//         setUser(null);
//       }
//     } catch (error) {
//       console.error("❌ AuthContext: Error fetching session:", error);
//       setUser(null);
//     }
//   }, []);

//   // Initial load
//   useEffect(() => {
//     console.log("🚀 AuthContext: Initial mount");

//     const initAuth = async () => {
//       setIsLoading(true);
//       await refreshUser();
//       setIsLoading(false);
//       console.log("✅ AuthContext: Initial load complete");
//     };

//     initAuth();
//   }, [refreshUser]);

//   // Logout function
//   const logout = useCallback(async () => {
//     console.log("🚪 AuthContext: Logging out...");

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (response.ok) {
//         console.log("✅ Logout successful");
//       } else {
//         console.error("❌ Logout failed:", response.status);
//       }
//     } catch (error) {
//       console.error("❌ Logout error:", error);
//     } finally {
//       // Always clear user state
//       setUser(null);
//       router.push("/login");
//     }
//   }, [router]);

//   const value = {
//     user,
//     isLoading,
//     refreshUser,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   // ✅ CRITICAL FIX: Better error message
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   return context;
// }

// contexts/auth-context.tsx
// ✅ COMPLETE VERSION: With isLoggingOut state

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    //console.log("🔄 AuthContext: Refreshing user...");

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      // console.log("📡 Session API Response:", {
      //   status: response.status,
      //   ok: response.ok,
      // });

      // ✅ CRITICAL FIX: Check if response is ok before parsing
      if (!response.ok) {
        //console.log("❌ Session API returned error:", response.status);
        setUser(null);
        return;
      }

      const data = await response.json();
      console.log("📦 Session API Data:", {
        success: data?.success,
        authenticated: data?.authenticated,
        hasUser: !!data?.user,
      });

      // ✅ CRITICAL FIX: Robust null checks
      if (
        data &&
        data.success === true &&
        data.authenticated === true &&
        data.user
      ) {
        console.log("✅ User authenticated:", data.user.email);
        setUser(data.user);
      } else {
        console.log("❌ User not authenticated or invalid response");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ AuthContext: Error fetching session:", error);
      setUser(null);
    }
  }, []);

  // Initial load
  useEffect(() => {
    //console.log("🚀 AuthContext: Initial mount");

    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
      //console.log("✅ AuthContext: Initial load complete");
    };

    initAuth();
  }, [refreshUser]);

  // Logout function
  const logout = useCallback(async () => {
    console.log("🚪 AuthContext: Logging out...");
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("✅ Logout successful");
      } else {
        console.error("❌ Logout failed:", response.status);
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      // Always clear user state
      setUser(null);
      setIsLoggingOut(false);
      router.push("/login");
    }
  }, [router]);

  const value = {
    user,
    isLoading,
    isLoggingOut,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  // ✅ CRITICAL FIX: Better error message
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
