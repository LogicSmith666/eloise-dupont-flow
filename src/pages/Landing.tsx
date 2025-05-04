
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import { ArrowRight, FileText, BarChart, Clock, CheckCircle, Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 eloise-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Streamline Your Business Funding Process
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            Éloïse Dupont connects brokers, lenders, and business owners through an efficient, automated financial processing platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/signup')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="border-white text-white hover:bg-white hover:text-eloise-navy"
            >
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Éloïse Dupont</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-eloise-lightblue flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-eloise-navy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Automate document extraction and reduce application processing time from days to minutes.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-eloise-lightblue flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-eloise-navy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Increase Accuracy</h3>
              <p className="text-gray-600">
                AI-powered extraction eliminates manual data entry errors and provides consistent results.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-eloise-lightblue flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-eloise-navy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Effortless Processing</h3>
              <p className="text-gray-600">
                Upload documents once and let our system extract all the necessary financial information.
              </p>
            </div>

            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-eloise-lightblue flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-eloise-navy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Better Decisions</h3>
              <p className="text-gray-600">
                Make informed funding decisions based on accurate data extracted from financial documents.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-eloise-lightblue flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-eloise-navy" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Bank-level security for all uploaded documents and extracted financial data.
              </p>
            </div>
            
            <div className="p-6 border rounded-lg bg-eloise-navy text-white">
              <h3 className="text-xl font-bold mb-4">Ready to transform your funding process?</h3>
              <p className="mb-4">
                Join Éloïse Dupont today and experience the future of financial document processing.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/signup')}
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-eloise-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
              <p className="text-gray-600">
                Brokers upload business owners' financial documents directly to the platform.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-eloise-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Automated Processing</h3>
              <p className="text-gray-600">
                Our system extracts key financial data from the documents using advanced AI technology.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-eloise-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Funding Decision</h3>
              <p className="text-gray-600">
                Lenders review the organized data and make informed funding decisions quickly.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 eloise-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Revolutionize Your Funding Process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Éloïse Dupont and experience faster, more efficient financial document processing and funding decisions.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/signup')}
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Landing;
