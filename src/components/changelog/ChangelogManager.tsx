
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChangelogEntry {
  version: string;
  date: string;
  author: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking';
  title: string;
  description: string;
  changes: string[];
}

const ChangelogManager = () => {
  const [entry, setEntry] = useState<ChangelogEntry>({
    version: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    type: 'feature',
    title: '',
    description: '',
    changes: ['']
  });

  const { toast } = useToast();

  const addChange = () => {
    setEntry(prev => ({
      ...prev,
      changes: [...prev.changes, '']
    }));
  };

  const removeChange = (index: number) => {
    setEntry(prev => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index)
    }));
  };

  const updateChange = (index: number, value: string) => {
    setEntry(prev => ({
      ...prev,
      changes: prev.changes.map((change, i) => i === index ? value : change)
    }));
  };

  const handleSave = () => {
    if (!entry.version || !entry.title || !entry.description || !entry.author) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty changes
    const filteredChanges = entry.changes.filter(change => change.trim() !== '');
    
    if (filteredChanges.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one change.",
        variant: "destructive",
      });
      return;
    }

    const finalEntry = { ...entry, changes: filteredChanges };
    
    // Here you would save to your backend
    console.log('Saving changelog entry:', finalEntry);

    toast({
      title: "Success",
      description: "Changelog entry saved successfully.",
    });

    // Reset form
    setEntry({
      version: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      type: 'feature',
      title: '',
      description: '',
      changes: ['']
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Changelog Entry
        </CardTitle>
        <CardDescription>
          Create a new changelog entry to document changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="version">Version *</Label>
            <Input
              id="version"
              placeholder="e.g., v1.2.0"
              value={entry.version}
              onChange={(e) => setEntry(prev => ({ ...prev, version: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={entry.date}
              onChange={(e) => setEntry(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="e.g., Development Team"
              value={entry.author}
              onChange={(e) => setEntry(prev => ({ ...prev, author: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select value={entry.type} onValueChange={(value: any) => setEntry(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
                <SelectItem value="bugfix">Bug Fix</SelectItem>
                <SelectItem value="breaking">Breaking Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Brief title describing the changes"
            value={entry.title}
            onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the changes"
            value={entry.description}
            onChange={(e) => setEntry(prev => ({ ...prev, description: e.target.value }))}
            className="min-h-20"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Changes *</Label>
          {entry.changes.map((change, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Describe a specific change"
                value={change}
                onChange={(e) => updateChange(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeChange(index)}
                disabled={entry.changes.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addChange}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Change
          </Button>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Changelog Entry
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChangelogManager;
