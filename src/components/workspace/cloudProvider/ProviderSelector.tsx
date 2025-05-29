
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Cloud Provider</Label>
      <Select value={selectedProvider} onValueChange={onProviderChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a cloud provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="aws">Amazon Web Services (AWS)</SelectItem>
          <SelectItem value="azure">Microsoft Azure</SelectItem>
          <SelectItem value="gcp">Google Cloud Platform (GCP)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProviderSelector;
