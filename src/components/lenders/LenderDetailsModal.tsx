import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LenderDetailsModalProps {
  lender: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LenderDetailsModal = ({ lender, open, onOpenChange }: LenderDetailsModalProps) => {
  if (!lender) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{lender.name}</DialogTitle>
          <DialogDescription>
            Complete lender information and configurations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Lender Name</label>
                  <p className="text-sm text-muted-foreground">{lender.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge variant={lender.status === 'active' ? 'default' : 'secondary'}>
                      {lender.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Created Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(lender.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lender Type Configurations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lender Type Configurations</CardTitle>
              <CardDescription>
                Different criteria for each lender type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lender.configurations?.map((config: any, index: number) => (
                  <div key={config.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Configuration {index + 1}</h4>
                      <Badge variant="outline">{config.lenderType}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Min POS</label>
                        <p className="text-sm text-muted-foreground">{config.minPos}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max POS</label>
                        <p className="text-sm text-muted-foreground">{config.maxPos}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Min TIB (months)</label>
                        <p className="text-sm text-muted-foreground">{config.minTib}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Min Revenue</label>
                        <p className="text-sm text-muted-foreground">
                          ${config.minRevenue?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Min FICO</label>
                        <p className="text-sm text-muted-foreground">{config.minFico}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max NSFs</label>
                        <p className="text-sm text-muted-foreground">{config.maxNsfs}</p>
                      </div>
                    </div>

                    {(config.restrictedStates?.length > 0 || config.restrictedIndustries?.length > 0 || config.restrictedEntityTypes?.length > 0) && (
                      <>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                          {config.restrictedStates?.length > 0 && (
                            <div>
                              <label className="text-sm font-medium">Restricted States</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {config.restrictedStates.map((state: string) => (
                                  <Badge key={state} variant="destructive" className="text-xs">
                                    {state}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {config.restrictedIndustries?.length > 0 && (
                            <div>
                              <label className="text-sm font-medium">Restricted Industries</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {config.restrictedIndustries.map((industry: string) => (
                                  <Badge key={industry} variant="destructive" className="text-xs">
                                    {industry}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {config.restrictedEntityTypes?.length > 0 && (
                            <div>
                              <label className="text-sm font-medium">Restricted Entity Types</label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {config.restrictedEntityTypes.map((entity: string) => (
                                  <Badge key={entity} variant="destructive" className="text-xs">
                                    {entity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {(config.conditionalIndustries?.length > 0 || config.defaultBkPolicy || config.bkPolicy) && (
                      <>
                        <Separator className="my-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {config.conditionalIndustries?.length > 0 && (
                            <div>
                              <label className="text-sm font-medium">Conditional Industries</label>
                              <div className="space-y-1 mt-1">
                                {config.conditionalIndustries.map((item: any) => (
                                  <div key={item.industry} className="text-sm">
                                    <Badge variant="outline" className="mr-2">
                                      {item.industry}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      ${item.revenue?.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {(config.defaultBkPolicy || config.bkPolicy) && (
                            <div>
                              <label className="text-sm font-medium">Default/BK Policy</label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {config.defaultBkPolicy || config.bkPolicy}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LenderDetailsModal;