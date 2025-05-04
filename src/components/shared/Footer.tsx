
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="h-6 w-6 rounded bg-eloise-navy text-white flex items-center justify-center font-bold text-sm">É</div>
          <span className="text-sm font-medium">Éloïse Dupont</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Éloïse Dupont. All rights reserved.
        </div>
        
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
          <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
