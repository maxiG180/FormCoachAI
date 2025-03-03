// components/ProtectedRoute.tsx
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Simply render the children without any checks
  return <>{children}</>;
};

export default ProtectedRoute;
