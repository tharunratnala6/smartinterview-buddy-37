import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Key, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface APIConfig {
  openai?: string;
  elevenlabs?: string;
}

const AIConfiguration = () => {
  const [apiKeys, setApiKeys] = useState<APIConfig>({});
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Load API keys from localStorage
    const savedKeys = localStorage.getItem('smart-interview-buddy-api-keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (error) {
        console.error('Error parsing saved API keys:', error);
      }
    }
  }, []);

  const saveAPIKey = (service: keyof APIConfig, key: string) => {
    const newKeys = { ...apiKeys, [service]: key };
    setApiKeys(newKeys);
    localStorage.setItem('smart-interview-buddy-api-keys', JSON.stringify(newKeys));
    toast.success(`${service} API key saved successfully!`);
  };

  const testConnection = async (service: keyof APIConfig) => {
    setIsTestingConnection(true);
    
    // Mock API test - replace with actual API calls
    setTimeout(() => {
      const isValid = apiKeys[service] && apiKeys[service]!.length > 10;
      setConnectionStatus(prev => ({ ...prev, [service]: isValid }));
      setIsTestingConnection(false);
      
      if (isValid) {
        toast.success(`${service} connection successful!`);
      } else {
        toast.error(`${service} connection failed. Please check your API key.`);
      }
    }, 1500);
  };

  const toggleKeyVisibility = (service: string) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    return key.slice(0, 8) + '•'.repeat(Math.max(0, key.length - 12)) + key.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI Configuration
        </h2>
        <p className="text-muted-foreground">
          Configure AI services to unlock advanced features
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          API keys are stored locally in your browser for security. They are never sent to our servers.
        </AlertDescription>
      </Alert>

      {/* OpenAI Configuration */}
      <Card className="bg-gradient-card border-0 shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            OpenAI API
            {connectionStatus.openai && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="openai-key"
                  type={showKeys.openai ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKeys.openai || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleKeyVisibility('openai')}
                >
                  {showKeys.openai ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Button 
                variant="outline"
                onClick={() => apiKeys.openai && saveAPIKey('openai', apiKeys.openai)}
                disabled={!apiKeys.openai}
              >
                <Key className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => testConnection('openai')}
                disabled={!apiKeys.openai || isTestingConnection}
              >
                {isTestingConnection ? (
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Test
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Used for: Interview question generation, answer analysis, and feedback</p>
            <p className="mt-1">
              Get your API key from{" "}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ElevenLabs Configuration */}
      <Card className="bg-gradient-card border-0 shadow-card-custom">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            ElevenLabs API (Optional)
            {connectionStatus.elevenlabs && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="elevenlabs-key">API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="elevenlabs-key"
                  type={showKeys.elevenlabs ? "text" : "password"}
                  placeholder="sk_..."
                  value={apiKeys.elevenlabs || ''}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, elevenlabs: e.target.value }))}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleKeyVisibility('elevenlabs')}
                >
                  {showKeys.elevenlabs ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Button 
                variant="outline"
                onClick={() => apiKeys.elevenlabs && saveAPIKey('elevenlabs', apiKeys.elevenlabs)}
                disabled={!apiKeys.elevenlabs}
              >
                <Key className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => testConnection('elevenlabs')}
                disabled={!apiKeys.elevenlabs || isTestingConnection}
              >
                {isTestingConnection ? (
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Test
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Used for: Text-to-speech for interview questions and voice input processing</p>
            <p className="mt-1">
              Get your API key from{" "}
              <a 
                href="https://elevenlabs.io/app/speech-synthesis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ElevenLabs Platform
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Mode Notice */}
      <Card className="bg-gradient-card border-0 shadow-card-custom">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Demo Mode Active</h3>
            <p className="text-sm text-muted-foreground">
              You can try the application with mock data. Configure API keys above for full AI functionality.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfiguration;