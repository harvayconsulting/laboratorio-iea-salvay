
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CapacitacionForm } from "./CapacitacionForm";
import { CapacitacionFormValues } from "./schema";

interface EditCapacitacionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: CapacitacionFormValues | null;
  onSubmit: (data: CapacitacionFormValues) => void;
}

export function EditCapacitacionDialog({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
}: EditCapacitacionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Capacitación</DialogTitle>
        </DialogHeader>
        {initialData && (
          <CapacitacionForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
