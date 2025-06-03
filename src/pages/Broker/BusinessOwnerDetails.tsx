
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, Upload, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Document types mapping
const DOCUMENT_TYPES = {
  "passport": "Passport",
  "idcard": "ID Card", 
  "bank_statement": "Bank Statement",
  "tax_return": "Tax Return"
};

// Mock uploaded files data
const MOCK_UPLOADED_FILES = [
  {
    id: "f1",
    fileName: "passport_copy.pdf",
    type: "passport",
    fileSize: 2.4,
    uploadedAt: "2024-01-15",
    fileUrl: "#"
  },
  {
    id: "f2", 
    fileName: "business_bank_statement_jan.pdf",
    type: "bank_statement",
    fileSize: 1.8,
    uploadedAt: "2024-01-15",
    fileUrl: "#"
  },
  {
    id: "f3",
    fileName: "2023_tax_return.pdf", 
    type: "tax_return",
    fileSize: 3.2,
    uploadedAt: "2024-01-15",
    fileUrl: "#"
  },
  {
    id: "f4",
    fileName: "drivers_license.jpg",
    type: "idcard", 
    fileSize: 0.8,
    uploadedAt: "2024-01-15",
    fileUrl: "#"
  }
];

const BusinessOwnerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState(MOCK_UPLOADED_FILES);
  const [isLoading, setIsLoading] = useState(false);
  
  // Business/Deal info (minimal)
  const [businessName] = useState("Cozy Coffee Shop");
  const [dealName] = useState("Q1 Capital Request");
  const [requestedAmount] = useState("$25,000");
  
  // Simulate fetching data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // Handle file download
  const handleDownload = (file: typeof MOCK_UPLOADED_FILES[0]) => {
    toast({
      title: "Download started",
      description: `Downloading ${file.fileName}...`,
    });
  };
  
  // Handle file view
  const handleView = (file: typeof MOCK_UPLOADED_FILES[0]) => {
    toast({
      title: "Opening file",
      description: `Opening ${file.fileName} in viewer...`,
    });
  };

  // Handle file replacement
  const handleFileReplace = (fileId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (!newFile) return;

    // Update the file in state (mock update)
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, fileName: newFile.name, fileSize: newFile.size / 1024 / 1024 }
        : f
    ));

    toast({
      title: "File updated",
      description: `${newFile.name} has been uploaded successfully.`,
    });

    // Reset input
    event.target.value = "";
  };

  // Handle file type change
  const handleTypeChange = (fileId: string, newType: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, type: newType } : f
    ));

    toast({
      title: "Document type updated", 
      description: "The document type has been changed successfully.",
    });
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
            <h1 className="text-3xl font-bold tracking-tight">{dealName}</h1>
            <p className="text-muted-foreground">
              {businessName} - {requestedAmount}
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Deal Summary</CardTitle>
            <CardDescription>Basic information about this deal submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Business Name</p>
                <p className="text-lg font-semibold">{businessName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Deal Name</p>
                <p className="text-lg font-semibold">{dealName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Requested Amount</p>
                <p className="text-lg font-semibold">{requestedAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              View, download, or update the documents submitted for this deal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{file.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={file.type} 
                          onValueChange={(value) => handleTypeChange(file.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{file.fileSize.toFixed(1)} MB</TableCell>
                      <TableCell>{file.uploadedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(file)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <input
                            type="file"
                            id={`replace-${file.id}`}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileReplace(file.id, e)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`replace-${file.id}`)?.click()}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Re-upload
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessOwnerDetails;
