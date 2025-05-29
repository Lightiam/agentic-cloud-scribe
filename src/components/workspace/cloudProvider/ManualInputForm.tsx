
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface ManualInputFormProps {
  selectedProvider: string;
  credentials: Record<string, string>;
  keyValuePairs: {key: string, value: string}[];
  onCredentialsChange: (credentials: Record<string, string>) => void;
  onKeyValuePairsChange: (pairs: {key: string, value: string}[]) => void;
}

const providerFields = {
  aws: [
    { name: 'access_key_id', label: 'Access Key ID', type: 'text', required: true },
    { name: 'secret_access_key', label: 'Secret Access Key', type: 'password', required: true },
    { name: 'region', label: 'Default Region', type: 'text', required: true }
  ],
  azure: [
    { name: 'client_id', label: 'Client ID', type: 'text', required: true },
    { name: 'client_secret', label: 'Client Secret', type: 'password', required: true },
    { name: 'tenant_id', label: 'Tenant ID', type: 'text', required: true },
    { name: 'subscription_id', label: 'Subscription ID', type: 'text', required: true }
  ],
  gcp: [
    { name: 'project_id', label: 'Project ID', type: 'text', required: true },
    { name: 'private_key_id', label: 'Private Key ID', type: 'text', required: true },
    { name: 'private_key', label: 'Private Key', type: 'textarea', required: true },
    { name: 'client_email', label: 'Client Email', type: 'email', required: true },
    { name: 'client_id', label: 'Client ID', type: 'text', required: true }
  ]
};

const ManualInputForm: React.FC<ManualInputFormProps> = ({
  selectedProvider,
  credentials,
  keyValuePairs,
  onCredentialsChange,
  onKeyValuePairsChange,
}) => {
  if (!selectedProvider) return null;

  const fields = providerFields[selectedProvider as keyof typeof providerFields] || [];

  const addKeyValuePair = () => {
    onKeyValuePairsChange([...keyValuePairs, { key: '', value: '' }]);
  };

  const removeKeyValuePair = (index: number) => {
    onKeyValuePairsChange(keyValuePairs.filter((_, i) => i !== index));
  };

  const updateKeyValuePair = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...keyValuePairs];
    updated[index][field] = value;
    onKeyValuePairsChange(updated);
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          {field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              value={credentials[field.name] || ''}
              onChange={(e) => onCredentialsChange({
                ...credentials,
                [field.name]: e.target.value
              })}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              className="min-h-20"
            />
          ) : (
            <Input
              id={field.name}
              type={field.type}
              value={credentials[field.name] || ''}
              onChange={(e) => onCredentialsChange({
                ...credentials,
                [field.name]: e.target.value
              })}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          )}
        </div>
      ))}
      
      <div className="mt-6">
        <Label className="text-base font-medium">Additional Credentials</Label>
        <p className="text-sm text-muted-foreground mb-3">Add any additional key-value pairs needed</p>
        {keyValuePairs.map((pair, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Key"
              value={pair.key}
              onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value"
              value={pair.value}
              onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeKeyValuePair(index)}
              disabled={keyValuePairs.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addKeyValuePair}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>
    </div>
  );
};

export default ManualInputForm;
