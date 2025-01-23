import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Priority } from "@/types/task";

interface AIAssistantProps {
  onAddTask: (title: string, priority: Priority) => void;
}

const AIAssistant = ({ onAddTask }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !apiKey.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a task management assistant. When users describe tasks, extract the task title and suggest a priority level (low, medium, or high) based on urgency and importance. Respond in JSON format like this: {"title": "task title", "priority": "low|medium|high"}. Keep titles concise.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      onAddTask(result.title, result.priority as Priority);
      setMessage("");
      toast({
        title: "Task created",
        description: `Added "${result.title}" with ${result.priority} priority`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">AI Task Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!apiKey && (
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                Enter your Perplexity API key to use the AI assistant
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your task..."
              disabled={isLoading || !apiKey}
            />
            <Button type="submit" disabled={isLoading || !apiKey}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Processing..." : "Send"}
            </Button>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIAssistant;