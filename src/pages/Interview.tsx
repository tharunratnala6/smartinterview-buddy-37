import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Mic, 
  MicOff, 
  Send, 
  Brain, 
  Timer, 
  CheckCircle, 
  AlertCircle,
  Star,
  ArrowRight,
  SkipForward
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: number;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  tips: string[];
}

const Interview = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const roles = [
    "Software Engineer",
    "Product Manager", 
    "Data Scientist",
    "UX Designer",
    "DevOps Engineer",
    "Sales Manager",
    "Marketing Specialist"
  ];

  const sampleQuestions: Question[] = [
    {
      id: 1,
      category: "Technical",
      difficulty: "Medium",
      question: "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?",
      tips: ["Compare data fetching", "Discuss flexibility", "Consider performance"]
    },
    {
      id: 2,
      category: "Behavioral", 
      difficulty: "Easy",
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
      tips: ["Use STAR method", "Focus on collaboration", "Show conflict resolution"]
    },
    {
      id: 3,
      category: "Problem Solving",
      difficulty: "Hard", 
      question: "How would you design a system that can handle 1 million concurrent users?",
      tips: ["Consider scalability", "Discuss load balancing", "Think about database optimization"]
    }
  ];

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  useEffect(() => {
    if (isInterviewStarted && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitAnswer();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeRemaining, isInterviewStarted]);

  const startInterview = () => {
    if (!selectedRole) {
      toast.error("Please select a job role first");
      return;
    }
    setIsInterviewStarted(true);
    toast.success("Interview started! Good luck!");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        // Here you would normally send to speech-to-text API
        setAnswer(prev => prev + " [Voice input captured]");
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const analyzeAnswer = (answer: string): any => {
    // Mock AI analysis - replace with actual AI API call
    const wordCount = answer.split(' ').length;
    const hasKeywords = currentQuestion.tips.some(tip => 
      answer.toLowerCase().includes(tip.toLowerCase())
    );
    
    const score = Math.min(90, Math.max(40, 
      (wordCount * 2) + (hasKeywords ? 20 : 0) + Math.random() * 20
    ));
    
    return {
      score: Math.round(score),
      strengths: [
        "Good technical knowledge demonstrated",
        "Clear communication style",
        "Relevant examples provided"
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider discussing edge cases",
        "Elaborate on implementation details"
      ],
      keywords: hasKeywords ? ["Technical concepts covered"] : ["Missing key concepts"],
      sentiment: score > 70 ? "Positive" : score > 50 ? "Neutral" : "Needs improvement"
    };
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const analysis = analyzeAnswer(answer);
      setFeedback(analysis);
      setIsProcessing(false);
      toast.success("Answer analyzed successfully!");
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setFeedback(null);
      setTimeRemaining(180);
    } else {
      toast.success("Interview completed! Great job!");
      setIsInterviewStarted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isInterviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI-Powered Mock Interview
            </h1>
            <p className="text-muted-foreground text-lg">
              Practice with realistic questions tailored to your role
            </p>
          </div>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Select Your Target Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {roles.map((role) => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? "hero" : "outline"}
                    onClick={() => setSelectedRole(role)}
                    className="h-12"
                  >
                    {role}
                  </Button>
                ))}
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  variant="premium" 
                  size="lg"
                  onClick={startInterview}
                  className="w-full md:w-auto"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{selectedRole} Interview</h1>
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {sampleQuestions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Timer className="h-5 w-5 text-primary" />
              {formatTime(timeRemaining)}
            </div>
            <Progress value={(180 - timeRemaining) / 180 * 100} className="w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-0 shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Current Question
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={currentQuestion.category === "Technical" ? "default" : "secondary"}>
                      {currentQuestion.category}
                    </Badge>
                    <Badge variant={
                      currentQuestion.difficulty === "Easy" ? "secondary" : 
                      currentQuestion.difficulty === "Medium" ? "default" : "destructive"
                    }>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
              </CardContent>
            </Card>

            {/* Answer Input */}
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here or use voice input..."
                  className="min-h-32 resize-none"
                />
                
                <div className="flex gap-3">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="flex-1"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Voice Input
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="success"
                    onClick={handleSubmitAnswer}
                    disabled={isProcessing || !answer.trim()}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips & Feedback */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning" />
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentQuestion.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Feedback */}
            {feedback && (
              <Card className="bg-gradient-card border-0 shadow-elegant animate-slide-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {feedback.score}%
                    </div>
                    <Badge variant={feedback.score > 70 ? "default" : "secondary"}>
                      {feedback.sentiment}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-accent mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="text-sm space-y-1">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-muted-foreground">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-warning mb-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Improvements
                      </h4>
                      <ul className="text-sm space-y-1">
                        {feedback.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="text-muted-foreground">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button
                    variant="hero"
                    onClick={nextQuestion}
                    className="w-full"
                  >
                    {currentQuestionIndex < sampleQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Complete Interview"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;