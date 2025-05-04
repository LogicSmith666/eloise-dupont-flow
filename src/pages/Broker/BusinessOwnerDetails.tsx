
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, PenLine, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

// Mock extracted data from AWS TextExt:
const MOCK_FINANCIAL_DATA = {
  "bankStatements": [
    { month: "January", revenue: "$45,670", expenses: "$32,450", balance: "$13,220" },
    { month: "February", revenue: "$51,230", expenses: "$35,620", balance: "$15,610" },
    { month: "March", revenue: "$48,950", expenses: "$34,780", balance: "$14,170" },
  ],
  "creditReport": {
    score: "720",
    inquiries: "2",
    accounts: "8",
    utilization: "32%",
    derogatory: "0",
  },
  "taxReturns": {
    annualRevenue: "$560,000",
    netProfit: "$98,500",
    taxPaid: "$27,450",
  }
};

const BusinessOwnerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Business owner details state
  const [businessName, setBusinessName] = useState("Cozy Coffee Shop");
  const [ownerName, setOwnerName] = useState("John Smith");
  const [email, setEmail] = useState("john@cozycoffee.com");
  const [phone, setPhone] = useState("(555) 123-4567");
  const [description, setDescription] = useState("A local coffee shop specializing in artisanal coffee and pastries.");
  const [requestedAmount, setRequestedAmount] = useState("25000");
  
  // Financial data state
  const [bankStatements, setBankStatements] = useState(MOCK_FINANCIAL_DATA.bankStatements);
  const [creditReport, setCreditReport] = useState(MOCK_FINANCIAL_DATA.creditReport);
  const [taxReturns, setTaxReturns] = useState(MOCK_FINANCIAL_DATA.taxReturns);
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate fetching data
  useEffect(() => {
    // This would be replaced with an actual API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // Handle save changes
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      
      toast({
        title: "Changes saved",
        description: "Business owner information has been updated successfully.",
      });
    }, 1000);
  };
  
  // Handle editing financial data rows
  const updateBankStatement = (index: number, field: string, value: string) => {
    const newBankStatements = [...bankStatements];
    newBankStatements[index] = { ...newBankStatements[index], [field]: value };
    setBankStatements(newBankStatements);
  };
  
  // Handle editing credit report data
  const updateCreditReport = (field: string, value: string) => {
    setCreditReport({ ...creditReport, [field]: value });
  };
  
  // Handle editing tax return data
  const updateTaxReturns = (field: string, value: string) => {
    setTaxReturns({ ...taxReturns, [field]: value });
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
            <h1 className="text-3xl font-bold tracking-tight">{businessName}</h1>
            <p className="text-muted-foreground">
              Business owner details and financial information
            </p>
          </div>
          <div className="ml-auto flex space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
              >
                <PenLine className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Basic information about the business and owner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName" 
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestedAmount">Requested Amount ($)</Label>
                  <Input 
                    id="requestedAmount" 
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input 
                    id="ownerName" 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted resize-none" : "resize-none"}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Credit Report Summary</CardTitle>
              <CardDescription>Key information from credit report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <Input 
                    id="creditScore"
                    value={creditReport.score}
                    onChange={(e) => updateCreditReport('score', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiries">Recent Inquiries</Label>
                  <Input 
                    id="inquiries"
                    value={creditReport.inquiries}
                    onChange={(e) => updateCreditReport('inquiries', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accounts">Open Accounts</Label>
                  <Input 
                    id="accounts"
                    value={creditReport.accounts}
                    onChange={(e) => updateCreditReport('accounts', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilization">Credit Utilization</Label>
                  <Input 
                    id="utilization"
                    value={creditReport.utilization}
                    onChange={(e) => updateCreditReport('utilization', e.target.value)}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Full Credit Report
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Bank Statement Analysis</CardTitle>
            <CardDescription>Financial data extracted from bank statements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankStatements.map((statement, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {isEditing ? (
                          <Input 
                            value={statement.month}
                            onChange={(e) => updateBankStatement(index, 'month', e.target.value)}
                            className="h-8 py-1"
                          />
                        ) : statement.month}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={statement.revenue}
                            onChange={(e) => updateBankStatement(index, 'revenue', e.target.value)}
                            className="h-8 py-1"
                          />
                        ) : statement.revenue}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={statement.expenses}
                            onChange={(e) => updateBankStatement(index, 'expenses', e.target.value)}
                            className="h-8 py-1"
                          />
                        ) : statement.expenses}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={statement.balance}
                            onChange={(e) => updateBankStatement(index, 'balance', e.target.value)}
                            className="h-8 py-1"
                          />
                        ) : statement.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Bank Statements
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tax Return Summary</CardTitle>
            <CardDescription>Key figures from most recent tax filing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Annual Revenue</p>
                {isEditing ? (
                  <Input 
                    value={taxReturns.annualRevenue}
                    onChange={(e) => updateTaxReturns('annualRevenue', e.target.value)}
                  />
                ) : (
                  <p className="text-2xl font-bold">{taxReturns.annualRevenue}</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Net Profit</p>
                {isEditing ? (
                  <Input 
                    value={taxReturns.netProfit}
                    onChange={(e) => updateTaxReturns('netProfit', e.target.value)}
                  />
                ) : (
                  <p className="text-2xl font-bold">{taxReturns.netProfit}</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Tax Paid</p>
                {isEditing ? (
                  <Input 
                    value={taxReturns.taxPaid}
                    onChange={(e) => updateTaxReturns('taxPaid', e.target.value)}
                  />
                ) : (
                  <p className="text-2xl font-bold">{taxReturns.taxPaid}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Tax Returns
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BusinessOwnerDetails;
