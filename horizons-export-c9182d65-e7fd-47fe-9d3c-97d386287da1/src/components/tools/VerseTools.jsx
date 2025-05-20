import React from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { Button } from "@/components/ui/button";
    import { Settings, BookOpen, Link, MessageSquare, Library, Search } from 'lucide-react';

    const VerseTools = ({ book, chapter, verse, verseId, version }) => {
      const tools = [
        { name: "Interlinear", icon: <BookOpen className="h-4 w-4 mr-2" />, functionName: "interlinear-handler", params: [book, chapter, verse] },
        { name: "Verse Analysis", icon: <Search className="h-4 w-4 mr-2" />, functionName: "verse-details-handler", params: [version, book, chapter, verse] },
        { name: "Cross-Refs", icon: <Link className="h-4 w-4 mr-2" />, functionName: "cross-references-handler", params: [book, chapter, verse] },
        { name: "Commentaries", icon: <MessageSquare className="h-4 w-4 mr-2" />, functionName: "commentaries-handler", params: [book, chapter, verse] },
        { name: "Dictionaries", icon: <Library className="h-4 w-4 mr-2" />, functionName: "dictionaries-handler", params: [book, chapter, verse] },
      ];

      const [activeTab, setActiveTab] = React.useState(tools[0].name);
      const [toolData, setToolData] = React.useState(null);
      const [isLoading, setIsLoading] = React.useState(false);
      const [currentToolNameForData, setCurrentToolNameForData] = React.useState('');


      const fetchToolData = async (toolConfig) => {
        if (!toolConfig || !supabase.functionsUrl) {
          setToolData({ error: "Tool configuration or Supabase functions URL is missing." });
          return;
        }
        
        setIsLoading(true);
        setToolData(null);
        setCurrentToolNameForData(toolConfig.name.toLowerCase().replace(/\s|-/g, '_'));

        const functionPath = toolConfig.params.join('/');
        const fullApiUrl = `${supabase.functionsUrl}/${toolConfig.functionName}/${functionPath}`;

        try {
          const response = await fetch(fullApiUrl);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setToolData(data);
        } catch (error) {
          console.error("Failed to fetch tool data:", error);
          setToolData({ error: error.message || "Failed to load data." });
        } finally {
          setIsLoading(false);
        }
      };

      React.useEffect(() => {
        const currentTool = tools.find(t => t.name === activeTab);
        if (currentTool && currentTool.params.every(p => p)) { // Ensure all params are present
          fetchToolData(currentTool);
        } else if (currentTool) {
          setToolData({ error: "Missing parameters for this tool."});
          setIsLoading(false);
        }
      }, [activeTab, book, chapter, verse, version]);


      if (!book || !chapter || !verse || !verseId || !version) {
        return <div className="p-4 text-sm text-muted-foreground">Select a verse to see tools.</div>;
      }

      return (
        <div className="p-2 bg-card/80 backdrop-blur-sm rounded-lg shadow-lg border border-border">
          <div className="flex justify-between items-center mb-3 px-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Tools for: <span className="text-primary">{version} {book} {chapter}:{verse}</span>
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 h-auto p-1">
              {tools.map((tool) => (
                <TabsTrigger key={tool.name} value={tool.name} className="flex-col sm:flex-row h-auto sm:h-10 py-2 px-1 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md">
                  {tool.icon}
                  <span className="mt-1 sm:mt-0">{tool.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {tools.map((tool) => (
              <TabsContent key={tool.name} value={tool.name} className="mt-4 p-1 text-sm min-h-[150px] bg-background/50 rounded-md border border-input">
                {isLoading && currentToolNameForData === tool.name.toLowerCase().replace(/\s|-/g, '_') && <p>Loading {tool.name.toLowerCase()} data...</p>}
                {!isLoading && toolData && (toolData.tool === tool.name.toLowerCase().replace(/\s|-/g, '_') || (toolData.error && currentToolNameForData === tool.name.toLowerCase().replace(/\s|-/g, '_'))) && (
                  <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(toolData, null, 2)}</pre>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      );
    };

    export default VerseTools;
