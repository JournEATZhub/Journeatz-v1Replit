import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Logo className="w-12 h-12" />
        <h1 className={title.includes("Admin") || title.includes("Kitchen") ? "text-3xl font-bold neon-orange-text" : "text-3xl font-bold neon-green-text"}>
          {title}
        </h1>
      </div>
      <Button 
        onClick={handleLogout}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Logout
      </Button>
    </div>
  );
}
