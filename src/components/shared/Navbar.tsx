
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user) return;

    switch (user.role) {
      case 'SuperAdmin':
        navigate('/super-admin/dashboard');
        break;
      case 'Admin':
        navigate('/firm-admin/dashboard');
        break;
      case 'Processor':
        navigate('/processor/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="h-8 w-8 rounded bg-eloise-navy text-white flex items-center justify-center font-bold">É</div>
          <span className="font-semibold text-lg">Éloïse Dupont</span>
        </div>

        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
              <Button onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={goToDashboard}>Dashboard</Button>
              <Button variant="outline" onClick={logout}>Log out</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
