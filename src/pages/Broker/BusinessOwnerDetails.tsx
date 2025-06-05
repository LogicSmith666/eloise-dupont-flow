
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, Upload, FileText, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  
  // Modal states
  const [showTypeChangeModal, setShowTypeChangeModal] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState<{
    fileId: string;
    newType: string;
    fileName: string;
  } | null>(null);
  
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

  // Handle new file upload
  const handleNewFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (!newFile) return;

    // Create new file entry
    const newFileEntry = {
      id: `f${Date.now()}`,
      fileName: newFile.name,
      type: "passport", // Default type
      fileSize: newFile.size / 1024 / 1024,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileUrl: "#"
    };

    setUploadedFiles(prev => [...prev, newFileEntry]);

    toast({
      title: "File uploaded",
      description: `${newFile.name} has been uploaded successfully.`,
    });

    // Reset input
    event.target.value = "";
  };

  // Handle file type change with confirmation
  const handleTypeChangeRequest = (fileId: string, newType: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || file.type === newType) return;

    setPendingTypeChange({
      fileId,
      newType,
      fileName: file.fileName
    });
    setShowTypeChangeModal(true);
  };

  // Confirm type change
  const handleConfirmTypeChange = () => {
    if (!pendingTypeChange) return;

    setUploadedFiles(prev => prev.map(f => 
      f.id === pendingTypeChange.fileId ? { ...f, type: pendingTypeChange.newType } : f
    ));

    toast({
      title: "Document type updated", 
      description: "The document type has been changed successfully.",
    });

    setShowTypeChangeModal(false);
    setPendingTypeChange(null);
  };

  // Cancel type change
  const handleCancelTypeChange = () => {
    setShowTypeChangeModal(false);
    setPendingTypeChange(null);
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{dealName}</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {businessName} - {requestedAmount}
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Deal Summary</CardTitle>
            <CardDescription className="text-sm">Basic information about this deal submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Business Name</p>
                <p className="text-base md:text-lg font-semibold break-words">{businessName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Deal Name</p>
                <p className="text-base md:text-lg font-semibold break-words">{dealName}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Requested Amount</p>
                <p className="text-base md:text-lg font-semibold">{requestedAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg md:text-xl">Uploaded Documents</CardTitle>
                <CardDescription className="text-sm">
                  View, download, or update the documents submitted for this deal
                </CardDescription>
              </div>
              <div>
                <input
                  type="file"
                  id="add-new-file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleNewFileUpload}
                />
                <Button
                  onClick={() => document.getElementById('add-new-file')?.click()}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New File
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop view */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">File Name</TableHead>
                      <TableHead className="min-w-[140px]">Document Type</TableHead>
                      <TableHead className="min-w-[80px]">Size</TableHead>
                      <TableHead className="min-w-[100px]">Date</TableHead>
                      <TableHead className="min-w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-sm truncate">{file.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={file.type} 
                            onValueChange={(value) => handleTypeChangeRequest(file.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
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
                        <TableCell className="text-sm">{file.fileSize.toFixed(1)} MB</TableCell>
                        <TableCell className="text-sm">{file.uploadedAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(file)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDownload(file)}
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4" />
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
                              size="icon"
                              onClick={() => document.getElementById(`replace-${file.id}`)?.click()}
                              className="h-8 w-8"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tablet view */}
            <div className="hidden md:block lg:hidden space-y-4">
              {uploadedFiles.map((file) => (
                <Card key={file.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.fileSize.toFixed(1)} MB • {file.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleView(file)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(file)}
                          className="h-8 w-8"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <input
                          type="file"
                          id={`replace-tablet-${file.id}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileReplace(file.id, e)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => document.getElementById(`replace-tablet-${file.id}`)?.click()}
                          className="h-8 w-8"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Document Type</label>
                      <Select 
                        value={file.type} 
                        onValueChange={(value) => handleTypeChangeRequest(file.id, value)}
                      >
                        <SelectTrigger className="w-full">
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mobile view */}
            <div className="block md:hidden space-y-4">
              {uploadedFiles.map((file) => (
                <Card key={file.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm break-all">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.fileSize.toFixed(1)} MB • {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">Document Type</label>
                        <Select 
                          value={file.type} 
                          onValueChange={(value) => handleTypeChangeRequest(file.id, value)}
                        >
                          <SelectTrigger className="w-full">
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
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleView(file)}
                          className="h-10 w-10"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(file)}
                          className="h-10 w-10"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                        <input
                          type="file"
                          id={`replace-mobile-${file.id}`}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileReplace(file.id, e)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => document.getElementById(`replace-mobile-${file.id}`)?.click()}
                          className="h-10 w-10"
                        >
                          <Upload className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Type Change Confirmation Modal */}
        <Dialog open={showTypeChangeModal} onOpenChange={setShowTypeChangeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Document Type Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change the document type for "{pendingTypeChange?.fileName}" to{" "}
                {pendingTypeChange ? DOCUMENT_TYPES[pendingTypeChange.newType as keyof typeof DOCUMENT_TYPES] : ""}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelTypeChange}>
                Cancel
              </Button>
              <Button onClick={handleConfirmTypeChange}>
                Confirm Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BusinessOwnerDetails;
