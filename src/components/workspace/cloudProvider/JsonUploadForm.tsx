
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonUploadFormProps {
  jsonFile: File | null;
  credentials: Record<string, string>;
  onFileUpload: (file: File | null) => void;
  onCredentialsChange: (credentials: Record<string, string>) => void;
}

const JsonUploadForm: React.FC<JsonUploadFormProps> = ({
  jsonFile,
  credentials,
  onFileUpload,
  onCredentialsChange,
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      onFileUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target?.result as string);
          onCredentialsChange(jsonContent);
          toast({
            title: "JSON file loaded",
            description: "Credentials have been parsed from the JSON file.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Invalid JSON file format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid JSON file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Label htmlFor="json-upload" className="cursor-pointer">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Upload JSON credentials file
            </span>
            <Input
              id="json-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Label>
          <p className="text-xs text-gray-500 mt-1">
            Or drag and drop a JSON file here
          </p>
        </div>
      </div>

      {jsonFile && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            ✓ Loaded: {jsonFile.name}
          </p>
        </div>
      )}

      {Object.keys(credentials).length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Parsed Credentials:</Label>
          <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-700">
              {JSON.stringify(credentials, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonUploadForm;
