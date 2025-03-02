
import React from "react";
import { NicheInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, User, Info, Edit, Trash, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface NicheDetailPanelProps {
  niche: NicheInfo | null;
  onClose: () => void;
  onEdit?: () => void;
  onReserve?: () => void;
  onAssign?: () => void;
  onRelease?: () => void;
}

export const NicheDetailPanel = ({ 
  niche, 
  onClose,
  onEdit,
  onReserve,
  onAssign,
  onRelease
}: NicheDetailPanelProps) => {
  if (!niche) return null;

  const statusMap = {
    available: { label: "Disponibile", color: "bg-green-100 text-green-800" },
    reserved: { label: "Riservato", color: "bg-yellow-100 text-yellow-800" },
    occupied: { label: "Occupato", color: "bg-red-100 text-red-800" },
    maintenance: { label: "Manutenzione", color: "bg-gray-100 text-gray-800" }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>Dettaglio Nicchia {niche.row}-{niche.column}</CardTitle>
          <Badge className={statusMap[niche.status].color}>
            {statusMap[niche.status].label}
          </Badge>
        </div>
        <CardDescription>
          Informazioni e gestione della nicchia selezionata
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {niche.status === 'occupied' && niche.deceasedName && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Occupante</h3>
                <p>{niche.deceasedName}</p>
              </div>
            </div>
            
            {niche.expirationDate && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Data di scadenza</h3>
                  <p>{format(new Date(niche.expirationDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifica informazioni
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full justify-start">
                    <Trash className="h-4 w-4 mr-2" />
                    Libera nicchia
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conferma operazione</DialogTitle>
                    <DialogDescription>
                      Sei sicuro di voler liberare questa nicchia? Questa azione rimuoverà l'assegnazione 
                      attuale ma non eliminerà i dati della persona defunta dal sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annulla</Button>
                    <Button variant="destructive" onClick={onRelease}>Conferma</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
        
        {niche.status === 'available' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Informazioni</h3>
                <p>Questa nicchia è disponibile per l'assegnazione o la prenotazione.</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={onReserve}>
                <Calendar className="h-4 w-4 mr-2" />
                Prenota nicchia
              </Button>
              
              <Button variant="default" size="sm" className="w-full justify-start" onClick={onAssign}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assegna nicchia
              </Button>
            </div>
          </div>
        )}
        
        {niche.status === 'reserved' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Prenotazione</h3>
                <p>Questa nicchia è stata prenotata ma non è ancora occupata.</p>
              </div>
            </div>
            
            {niche.expirationDate && (
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Scadenza prenotazione</h3>
                  <p>{format(new Date(niche.expirationDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex flex-col space-y-2">
              <Button variant="default" size="sm" className="w-full justify-start" onClick={onAssign}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assegna nicchia
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full justify-start">
                    <Trash className="h-4 w-4 mr-2" />
                    Cancella prenotazione
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conferma cancellazione</DialogTitle>
                    <DialogDescription>
                      Sei sicuro di voler cancellare questa prenotazione? La nicchia tornerà disponibile.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annulla</Button>
                    <Button variant="destructive" onClick={onRelease}>Conferma</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Chiudi
        </Button>
      </CardFooter>
    </Card>
  );
};
