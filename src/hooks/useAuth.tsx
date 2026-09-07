import { createContext, useContext, useState, ReactNode } from "react";

type AppRole = "citizen" | "authority" | "admin";

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    display_name: string;
  };
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  loading: boolean;
  role: AppRole | null;
  profile: {
    display_name: string;
    email: string | null;
    avatar_url: string | null;
  } | null;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);

  const profile = user
    ? {
        display_name: user.user_metadata.display_name,
        email: user.email,
        avatar_url: null,
      }
    : null;

  const session = user ? { user } : null;

  const signUp = async (
    email: string,
    _password: string,
    displayName: string
  ) => {
    const mockUser: MockUser = {
      id: crypto.randomUUID(),
      email,
      user_metadata: {
        display_name: displayName,
      },
    };

    setUser(mockUser);
    setRole("citizen");

    return { error: null };
  };

  const signIn = async (email: string, _password: string) => {
    const mockUser: MockUser = {
      id: "demo-user-001",
      email,
      user_metadata: {
        display_name: email.split("@")[0] || "Demo User",
      },
    };

    setUser(mockUser);

    // Demo login defaults to citizen.
    // Role can still be changed later when real backend is connected.
    setRole("citizen");

    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading: false,
        role,
        profile,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};