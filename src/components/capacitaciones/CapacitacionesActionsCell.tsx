
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CapacitacionActionsCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CapacitacionActionsCell({ onEdit, onDelete }: CapacitacionActionsCellProps) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
