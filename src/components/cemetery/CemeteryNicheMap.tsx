
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export interface CemeteryNicheMapProps {
  cemeteryId: string;
}

export const CemeteryNicheMap: React.FC<CemeteryNicheMapProps> = ({ cemeteryId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  
  // Mock data per le nicchie del cimitero
  const mockNiches = [
    { id: "1", section: "A", number: "101", status: "Occupata", occupant: "Mario Rossi", date: "12/05/2018" },
    { id: "2", section: "A", number: "102", status: "Libera", occupant: "", date: "" },
    { id: "3", section: "A", number: "103", status: "Riservata", occupant: "Famiglia Bianchi", date: "Prenotata" },
    { id: "4", section: "B", number: "201", status: "Occupata", occupant: "Giuseppe Verdi", date: "03/11/2020" },
    { id: "5", section: "B", number: "202", status: "Occupata", occupant: "Anna Neri", date: "15/07/2019" },
    { id: "6", section: "C", number: "301", status: "Libera", occupant: "", date: "" },
    { id: "7", section: "C", number: "302", status: "Manutenzione", occupant: "", date: "In ristrutturazione" },
  ];

  // Filtro per sezione e ricerca
  const filteredNiches = mockNiches.filter(niche => {
    const matchesSection = !selectedSection || niche.section === selectedSection;
    const matchesSearch = !searchTerm || 
      niche.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      niche.occupant.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSection && matchesSearch;
  });

  // Array delle sezioni disponibili
  const sections = Array.from(new Set(mockNiches.map(niche => niche.section)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5" />
          Mappa delle Nicchie
        </CardTitle>
        <CardDescription>
          Visualizza e gestisci le nicchie presenti nel cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant={!selectedSection ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setSelectedSection(null)}
              >
                Tutte
              </Button>
              {sections.map(section => (
                <Button 
                  key={section} 
                  variant={selectedSection === section ? "secondary" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedSection(section)}
                >
                  Sezione {section}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cerca nicchia o defunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {filteredNiches.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sezione</TableHead>
                    <TableHead>Numero</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Occupante</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNiches.map((niche) => (
                    <TableRow key={niche.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{niche.section}</TableCell>
                      <TableCell>{niche.number}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          niche.status === "Occupata" ? "bg-red-100 text-red-800" : 
                          niche.status === "Libera" ? "bg-green-100 text-green-800" : 
                          niche.status === "Riservata" ? "bg-blue-100 text-blue-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {niche.status}
                        </span>
                      </TableCell>
                      <TableCell>{niche.occupant || "-"}</TableCell>
                      <TableCell>{niche.date || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nessuna nicchia trovata con i criteri selezionati</p>
            </div>
          )}
          
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">Visualizzazione di {filteredNiches.length} nicchie su {mockNiches.length} totali</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
