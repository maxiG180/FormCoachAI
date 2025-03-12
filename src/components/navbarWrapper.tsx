"use client";

import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/contexts/authContext";

export default function NavbarWrapper() {
  const { user } = useAuth();

  return <Navbar user={user} />;
}
