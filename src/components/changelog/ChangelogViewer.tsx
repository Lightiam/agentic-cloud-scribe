
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Calendar, Tag, User, GitCommit } from "lucide-react";
import { format } from "date-fns";

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  author: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking';
  title: string;
  description: string;
  changes: string[];
}

const ChangelogViewer = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockEntries: ChangelogEntry[] = [
      {
        id: '1',
        version: 'v1.2.0',
        date: '2024-01-15',
        author: 'Development Team',
        type: 'feature',
        title: 'Multi-Cloud Deployment Support',
        description: 'Added support for deploying to multiple cloud providers simultaneously',
        changes: [
          'Added AWS, Azure, and GCP integration',
          'Multi-cloud cost comparison',
          'Unified deployment interface',
          'Cross-cloud resource monitoring'
        ]
      },
      {
        id: '2',
        version: 'v1.1.5',
        date: '2024-01-10',
        author: 'DevOps Team',
        type: 'improvement',
        title: 'Enhanced Security & Performance',
        description: 'Improved authentication and deployment speed',
        changes: [
          'Enhanced JWT token validation',
          'Optimized deployment pipeline',
          'Added rate limiting',
          'Improved error handling'
        ]
      },
      {
        id: '3',
        version: 'v1.1.0',
        date: '2024-01-05',
        author: 'Backend Team',
        type: 'feature',
        title: 'Real-time Deployment Monitoring',
        description: 'Added live monitoring and logging for deployments',
        changes: [
          'Real-time deployment status updates',
          'Live log streaming',
          'Resource usage metrics',
          'Alert notifications'
        ]
      }
    ];
    setEntries(mockEntries);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'bugfix':
        return 'bg-red-100 text-red-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      case 'breaking':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEntries = selectedType === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === selectedType);

  const generateMarkdown = () => {
    let markdown = '# Changelog\n\n';
    markdown += 'All notable changes to this project will be documented in this file.\n\n';
    
    entries.forEach(entry => {
      markdown += `## [${entry.version}] - ${entry.date}\n\n`;
      markdown += `**${entry.title}**\n\n`;
      markdown += `${entry.description}\n\n`;
      markdown += `### Changes\n\n`;
      entry.changes.forEach(change => {
        markdown += `- ${change}\n`;
      });
      markdown += `\n*Author: ${entry.author}*\n\n`;
      markdown += '---\n\n';
    });

    return markdown;
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CHANGELOG.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="h-5 w-5" />
                Changelog
              </CardTitle>
              <CardDescription>
                Track all changes and updates to the platform
              </CardDescription>
            </div>
            <Button onClick={downloadMarkdown} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download CHANGELOG.md
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All
            </Button>
            <Button
              variant={selectedType === 'feature' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('feature')}
            >
              Features
            </Button>
            <Button
              variant={selectedType === 'improvement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('improvement')}
            >
              Improvements
            </Button>
            <Button
              variant={selectedType === 'bugfix' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('bugfix')}
            >
              Bug Fixes
            </Button>
            <Button
              variant={selectedType === 'breaking' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('breaking')}
            >
              Breaking Changes
            </Button>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {filteredEntries.map((entry, index) => (
                <div key={entry.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {entry.version}
                        </Badge>
                        <Badge className={getTypeColor(entry.type)}>
                          {entry.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
                      <p className="text-muted-foreground mb-3">{entry.description}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Changes:</h4>
                      <ul className="space-y-1">
                        {entry.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      {entry.author}
                    </div>
                  </div>

                  {index < filteredEntries.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangelogViewer;
