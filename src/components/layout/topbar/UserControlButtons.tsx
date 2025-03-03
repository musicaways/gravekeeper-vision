
import { Bell, User2 } from "lucide-react";
import { Button } from "../../ui/button";

const UserControlButtons = () => {
  return (
    <>
      <Button variant="ghost" size="icon" type="button">
        <Bell className="h-5 w-5 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon" type="button">
        <User2 className="h-5 w-5 text-muted-foreground" />
      </Button>
    </>
  );
};

export default UserControlButtons;
