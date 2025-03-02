
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

const Topbar = ({ title, subtitle }: TopbarProps) => {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4 sticky top-0 z-10 bg-background/90 backdrop-blur-sm transition-all">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Icons.Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Icons.Search className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Icons.Sun className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Icons.HelpCircle className="h-5 w-5" />
        </Button>
        
        <div className="h-8 border-l mx-2"></div>
        
        <Button asChild>
          <Link to="/work-orders/new">
            <Icons.Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
