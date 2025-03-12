
import React from "react";
import { UserRound, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { DeceasedRecord } from "./types/deceased";
import { formatDate, isFemale, getLoculoLink, calculateAge } from "./utils/deceasedFormatters";
import CemeteryInfo from "./components/CemeteryInfo";
import LocationInfo from "./components/LocationInfo";
import LoculoInfo from "./components/LoculoInfo";

interface DeceasedItemProps {
  deceased: DeceasedRecord;
}

const DeceasedListItem: React.FC<DeceasedItemProps> = ({ deceased }) => {
  // Using the exact same color as in SectionsList
  const backgroundColor = "bg-primary/10"; // Match the bg-primary/10 from SectionsList
  const textColor = "text-primary-dark";
  
  const loculoLink = getLoculoLink(deceased);
  
  // Estrai i dati necessari per i link
  const cimiteroId = deceased.loculi?.Blocco?.Settore?.Cimitero?.Id || null;
  const bloccoId = deceased.loculi?.Blocco?.Id || null;
  
  // Calcoliamo l'età in base ai dati disponibili
  const età = deceased.eta !== null ? deceased.eta : calculateAge(deceased.data_nascita || null, deceased.data_decesso || null);

  return (
    <div className="border rounded-md hover:bg-accent/5 transition-colors h-full flex flex-col">
      <div 
        className={`px-3 py-2 rounded-t-md border-b ${backgroundColor}`}
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/30 shadow-sm backdrop-blur-sm shrink-0">
              {isFemale(deceased.nominativo) ? (
                <UserRound className="h-5 w-5 text-primary-dark" />
              ) : (
                <User className="h-5 w-5 text-primary-dark" />
              )}
            </div>
            <h3 className={`font-medium text-base ${textColor}`}>
              {deceased.nominativo}
            </h3>
          </div>
          
          {deceased.data_decesso && (
            <div className="flex items-center space-x-1 pl-13 ml-13 text-sm text-foreground/90">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>
                Dec. {formatDate(deceased.data_decesso)}
                {età !== null && età !== undefined && ` · ${età} anni`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-0 divide-y flex-grow flex flex-col">
        <CemeteryInfo 
          cimitero_nome={deceased.cimitero_nome}
          cimiteroId={cimiteroId}
        />
        
        <LocationInfo 
          settore_nome={deceased.settore_nome} 
          blocco_nome={deceased.blocco_nome}
          bloccoId={bloccoId}
        />
        
        <LoculoInfo 
          loculo_numero={deceased.loculo_numero}
          loculo_fila={deceased.loculo_fila}
          loculo_link={loculoLink}
        />
      </div>
    </div>
  );
};

export default DeceasedListItem;
