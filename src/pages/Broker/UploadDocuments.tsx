
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define supported file types
const SUPPORTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const UploadDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    const newFiles: File[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check if file type is supported
      if (SUPPORTED_TYPES.includes(file.type)) {
        newFiles.push(file);
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: `${file.name} is not a supported file type. Please upload PDF or image files.`,
        });
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please upload at least one document to continue.",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Upload successful!",
        description: `${files.length} documents for ${businessName} have been uploaded and are being processed.`,
      });
      
      setUploading(false);
      navigate("/broker/dashboard");
    }, 2000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/broker/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
            <p className="text-muted-foreground">
              Upload business owner's financial documents for funding application.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Provide details about the business applying for funding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input 
                      id="businessName" 
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
                    <Input 
                      id="requestedAmount" 
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea 
                    id="businessDescription" 
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Documents</CardTitle>
                <CardDescription>
                  Upload PDFs or images of business financial statements, bank statements, and other relevant documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid place-items-center border-2 border-dashed rounded-md p-8 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-lg font-semibold">Drop files here or click to upload</p>
                      <p className="text-sm text-muted-foreground">
                        Support for PDF, JPEG, PNG up to 10MB each
                      </p>
                    </div>
                    <Input 
                      id="file-upload" 
                      type="file" 
                      className="hidden"
                      multiple
                      accept={SUPPORTED_TYPES.join(",")}
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Select Files
                    </Button>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="border rounded-md">
                    <div className="p-3 border-b bg-muted/50">
                      <p className="font-medium text-sm">Uploaded Files ({files.length})</p>
                    </div>
                    <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                      {files.map((file, index) => (
                        <div 
                          key={`${file.name}-${index}`} 
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="text-sm">
                              <p className="font-medium truncate max-w-[300px]">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Submit Application</CardTitle>
                <CardDescription>
                  Submit the application for processing. Our system will extract key information from the documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  By submitting this application, you confirm that you have the business owner's consent to
                  share these financial documents for the purpose of obtaining funding.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/broker/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={uploading || files.length === 0 || !businessName || !requestedAmount}
                >
                  {uploading ? "Uploading..." : "Submit Application"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocuments;
