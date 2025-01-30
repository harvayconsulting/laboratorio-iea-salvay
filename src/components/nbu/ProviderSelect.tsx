import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ObraSocial {
  id: number;
  nameprovider: string;
  startdateprovider?: string;
  contactprovider?: string;
}

interface ProviderSelectProps {
  providers: ObraSocial[];
  selectedProvider: number | null;
  onProviderChange: (value: number) => void;
}

export function ProviderSelect({ providers, selectedProvider, onProviderChange }: ProviderSelectProps) {
  return (
    <div className="mb-6">
      <Select 
        value={selectedProvider?.toString()} 
        onValueChange={(value) => {
          console.log('Changing obra social to:', value);
          onProviderChange(Number(value));
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Seleccionar obra social" />
        </SelectTrigger>
        <SelectContent>
          {providers.map((provider) => (
            <SelectItem key={provider.id} value={provider.id.toString()}>
              {provider.nameprovider}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}