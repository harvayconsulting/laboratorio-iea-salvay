import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type InsuranceProvider = Database['public']['Enums']['insurance_provider'];

export const PROVIDERS: { value: InsuranceProvider; label: string }[] = [
  { value: 'AVALIAN', label: 'Avalian' },
  { value: 'APROSS', label: 'Apross' },
  { value: 'CAJA_ABOGADOS', label: 'Caja Abogados' },
  { value: 'CAJA_NOTARIAL', label: 'Caja Notarial' },
  { value: 'CPCE', label: 'CPCE' },
  { value: 'DASPU', label: 'DASPU' },
  { value: 'FEDERADA_1', label: 'Federada 1' },
  { value: 'FEDERADA_2_3_4000', label: 'Federada 2/3/4000' },
  { value: 'JERARQUICOS_PMO', label: 'Jerárquicos PMO' },
  { value: 'JERARQUICOS_ALTA_FRECUENCIA', label: 'Jerárquicos Alta Frecuencia' },
  { value: 'GALENO', label: 'Galeno' },
  { value: 'MEDIFE', label: 'Medife' },
  { value: 'MUTUAL_TAXI', label: 'Mutual Taxi' },
  { value: 'NOBIS', label: 'Nobis' },
  { value: 'OMINT', label: 'Omint' },
  { value: 'OSDE', label: 'OSDE' },
  { value: 'PAMI_1EROS_6', label: 'PAMI (1eros 6)' },
  { value: 'PAMI_(7MO_ADELANTE)', label: 'PAMI (7mo adelante)' },
  { value: 'PARTICULARES_BAJA', label: 'Particulares (baja)' },
  { value: 'PARTICULARES_ALTA', label: 'Particulares (alta)' },
  { value: 'PREVENCIÓN_A1_A2', label: 'Prevención A1/A2' },
  { value: 'PREVENCIÓN_A3_A6', label: 'Prevención A3/A6' },
  { value: 'SANCOR_500', label: 'Sancor 500' },
  { value: 'SANCOR_1000', label: 'Sancor 1000' },
  { value: 'SIPSSA', label: 'SIPSSA' },
  { value: 'SWISS_MEDICAL', label: 'Swiss Medical' },
];

interface ProviderSelectProps {
  selectedProvider: InsuranceProvider;
  onProviderChange: (value: InsuranceProvider) => void;
}

export function ProviderSelect({ selectedProvider, onProviderChange }: ProviderSelectProps) {
  return (
    <div className="mb-6">
      <Select 
        value={selectedProvider} 
        onValueChange={(value: InsuranceProvider) => {
          console.log('Changing provider to:', value);
          onProviderChange(value);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Seleccionar prestador" />
        </SelectTrigger>
        <SelectContent>
          {PROVIDERS.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}