
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Upload, X, Building, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define supported file types
const SUPPORTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

// Define document types
const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "idcard", label: "ID Card" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "tax_return", label: "Tax Return" },
];

// Mock business profiles
const MOCK_BUSINESS_PROFILES = [
  { id: 'bp1', businessName: 'Cozy Coffee Shop' },
  { id: 'bp2', businessName: 'Urban Fitness Center' },
  { id: 'bp3', businessName: 'Fresh Grocery Market' }
];

interface FileWithType {
  file: File;
  type: string;
  id: string;
}

const UploadDocuments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedBusinessProfile, setSelectedBusinessProfile] = useState("");
  const [dealName, setDealName] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [files, setFiles] = useState<FileWithType[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    
    const newFiles: FileWithType[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check if file type is supported
      if (SUPPORTED_TYPES.includes(file.type)) {
        newFiles.push({
          file,
          type: "", // Default empty type, user needs to select
          id: Math.random().toString(36).substr(2, 9)
        });
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
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateFileType = (id: string, type: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, type } : f));
  };

  const replaceFile = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    if (SUPPORTED_TYPES.includes(newFile.type)) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, file: newFile } : f));
      toast({
        title: "File updated",
        description: "The file has been successfully replaced.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Unsupported file type",
        description: "Please upload PDF or image files only.",
      });
    }

    // Reset input value
    e.target.value = "";
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBusinessProfile) {
      toast({
        variant: "destructive",
        title: "No business profile selected",
        description: "Please select a business profile to continue.",
      });
      return;
    }
    
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please upload at least one document to continue.",
      });
      return;
    }

    // Check if all files have types selected
    const filesWithoutType = files.filter(f => !f.type);
    if (filesWithoutType.length > 0) {
      toast({
        variant: "destructive",
        title: "Document types missing",
        description: "Please select a document type for all uploaded files.",
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const selectedBusiness = MOCK_BUSINESS_PROFILES.find(bp => bp.id === selectedBusinessProfile);
      toast({
        title: "Deal submitted successfully!",
        description: `"${dealName}" for ${selectedBusiness?.businessName} has been submitted with ${files.length} documents and is being processed.`,
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create New Deal</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Submit a new funding deal with business documentation.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Select Business Profile</CardTitle>
                <CardDescription className="text-sm">
                  Choose the business owner profile for this deal submission.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessProfile" className="text-sm md:text-base">Business Profile *</Label>
                  <Select value={selectedBusinessProfile} onValueChange={setSelectedBusinessProfile} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a business profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_BUSINESS_PROFILES.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4" />
                            {profile.businessName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Don't see the business? <Button variant="link" className="p-0 h-auto text-xs" onClick={() => navigate('/broker/business-profiles')}>Add a new business profile</Button>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Deal Information</CardTitle>
                <CardDescription className="text-sm">
                  Provide details about the funding request.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dealName" className="text-sm md:text-base">Deal Name *</Label>
                    <Input 
                      id="dealName" 
                      placeholder="Enter a descriptive name for this deal"
                      value={dealName}
                      onChange={(e) => setDealName(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedAmount" className="text-sm md:text-base">Requested Amount ($)</Label>
                    <Input 
                      id="requestedAmount" 
                      placeholder="25000"
                      value={requestedAmount}
                      onChange={(e) => setRequestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealDescription" className="text-sm md:text-base">Deal Description</Label>
                  <Textarea 
                    id="dealDescription" 
                    placeholder="Provide details about the funding purpose and business needs"
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Deal Documents</CardTitle>
                <CardDescription className="text-sm">
                  Upload documents and categorize them by type. Each document must have a type selected.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid place-items-center border-2 border-dashed rounded-md p-6 md:p-8 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="text-center space-y-4 w-full">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                      <p className="mt-2 text-base md:text-lg font-semibold">Upload Documents</p>
                      <p className="text-xs md:text-sm text-muted-foreground text-center">
                        Support for PDF, JPEG, PNG up to 10MB each
                      </p>
                    </div>
                    <Input 
                      id="file-upload" 
                      type="file" 
                      className="hidden"
                      accept={SUPPORTED_TYPES.join(",")}
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="w-full md:w-auto"
                    >
                      Select File
                    </Button>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="border rounded-md">
                    <div className="p-3 border-b bg-muted/50">
                      <p className="font-medium text-sm">Uploaded Files ({files.length})</p>
                    </div>
                    <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
                      {files.map((fileItem) => (
                        <div 
                          key={fileItem.id}
                          className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 p-3 border rounded-md bg-background"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                            <div className="text-sm flex-1 min-w-0">
                              <p className="font-medium truncate">{fileItem.file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2 md:shrink-0">
                            <Select 
                              value={fileItem.type} 
                              onValueChange={(value) => updateFileType(fileItem.id, value)}
                            >
                              <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {DOCUMENT_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <div className="flex space-x-2">
                              <input
                                type="file"
                                id={`replace-${fileItem.id}`}
                                className="hidden"
                                accept={SUPPORTED_TYPES.join(",")}
                                onChange={(e) => replaceFile(fileItem.id, e)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`replace-${fileItem.id}`)?.click()}
                                className="shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeFile(fileItem.id)}
                                className="shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Submit Deal</CardTitle>
                <CardDescription className="text-sm">
                  Submit the deal for processing. Our team will review the documents and provide funding approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  By submitting this deal, you confirm that you have the business owner's consent to
                  share these financial documents for the purpose of obtaining funding.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/broker/dashboard')}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={uploading || files.length === 0 || !dealName || !selectedBusinessProfile || files.some(f => !f.type)}
                  className="w-full md:w-auto"
                >
                  {uploading ? "Submitting..." : "Submit Deal"}
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
