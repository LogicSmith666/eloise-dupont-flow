
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, ArrowLeft, Target, Filter } from "lucide-react";

const LenderMatchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [lenderTypeFilter, setLenderTypeFilter] = useState<string>("all");
  const [matchStatusFilter, setMatchStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Get results from location state or localStorage as fallback
    const matchResults = location.state?.results || JSON.parse(localStorage.getItem('lenderMatchResults') || 'null');
    
    if (!matchResults) {
      // If no results, redirect back to dashboard
      navigate('/processor/dashboard');
      return;
    }
    
    setResults(matchResults);
    
    // Clean up localStorage after getting results
    localStorage.removeItem('lenderMatchResults');
  }, [location, navigate]);

  // Get unique lender types for filter dropdown
  const getUniqueLenderTypes = () => {
    if (!results) return [];
    const types = new Set<string>();
    results.results.forEach((dealResult: any) => {
      dealResult.lender_matches.forEach((match: any) => {
        types.add(match.lender_type);
      });
    });
    return Array.from(types);
  };

  // Filter lender matches based on selected filters
  const getFilteredResults = () => {
    if (!results) return null;
    
    return {
      ...results,
      results: results.results.map((dealResult: any) => ({
        ...dealResult,
        lender_matches: dealResult.lender_matches.filter((match: any) => {
          const typeMatch = lenderTypeFilter === "all" || match.lender_type === lenderTypeFilter;
          const statusMatch = matchStatusFilter === "all" || 
            (matchStatusFilter === "matched" && match.overall_match) ||
            (matchStatusFilter === "not-matched" && !match.overall_match);
          
          return typeMatch && statusMatch;
        })
      })).filter((dealResult: any) => dealResult.lender_matches.length > 0)
    };
  };

  const filteredResults = getFilteredResults();
  const uniqueLenderTypes = getUniqueLenderTypes();

  const handleBackToDashboard = () => {
    navigate('/processor/dashboard');
  };

  if (!results) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Lender Matching Results</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Processed {results.total_deals_processed} deal{results.total_deals_processed > 1 ? 's' : ''}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                • Checked {results.total_lenders_checked} lenders
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Lender Type</label>
                <Select value={lenderTypeFilter} onValueChange={setLenderTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueLenderTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Match Status</label>
                <Select value={matchStatusFilter} onValueChange={setMatchStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="matched">Matched Only</SelectItem>
                    <SelectItem value="not-matched">Not Matched Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLenderTypeFilter("all");
                    setMatchStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filteredResults && filteredResults.results.length > 0 ? (
            filteredResults.results.map((dealResult: any) => (
            <Card key={dealResult.deal_id}>
              <CardHeader>
                <div className="flex items-center space-x-2 pb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{dealResult.deal_name}</CardTitle>
                </div>
                <CardDescription>
                  Found {dealResult.lender_matches.length} lender{dealResult.lender_matches.length > 1 ? 's' : ''} for this deal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dealResult.lender_matches.map((match: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-base">{match.lender_name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {match.lender_type.replace('_', ' ')}
                            </Badge>
                            {match.overall_match && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                Match Found!
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Feedback</p>
                        <div className="space-y-1">
                          {match.feedback.map((feedback: string, feedbackIndex: number) => (
                            <p key={feedbackIndex} className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-muted">
                              {feedback}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No results match the current filters.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <Button onClick={handleBackToDashboard} size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LenderMatchResults;
