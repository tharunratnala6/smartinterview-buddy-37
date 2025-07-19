import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Target,
  Star,
  Download,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  sections: {
    contact: { score: number; feedback: string[] };
    summary: { score: number; feedback: string[] };
    experience: { score: number; feedback: string[] };
    education: { score: number; feedback: string[] };
    skills: { score: number; feedback: string[] };
  };
  keywords: {
    present: string[];
    missing: string[];
  };
  improvements: string[];
  strengths: string[];
}

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("word")) {
        setSelectedFile(file);
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Please upload a PDF or Word document");
      }
    }
  };

  const mockAnalyzeResume = (): ResumeAnalysis => {
    // Mock analysis - replace with actual AI API call
    return {
      overallScore: 78,
      atsScore: 85,
      sections: {
        contact: {
          score: 95,
          feedback: ["Complete contact information", "Professional email address", "LinkedIn profile included"]
        },
        summary: {
          score: 72,
          feedback: ["Good overview of experience", "Could be more specific about achievements", "Add relevant keywords"]
        },
        experience: {
          score: 80,
          feedback: ["Strong work history", "Quantified achievements", "Could add more technical details"]
        },
        education: {
          score: 88,
          feedback: ["Relevant degree listed", "Good GPA included", "Recent graduation noted"]
        },
        skills: {
          score: 65,
          feedback: ["Good technical skills", "Missing some trending technologies", "Add soft skills"]
        }
      },
      keywords: {
        present: ["JavaScript", "React", "Node.js", "Python", "AWS", "Leadership"],
        missing: ["Docker", "Kubernetes", "TypeScript", "GraphQL", "Microservices"]
      },
      improvements: [
        "Add more specific metrics and achievements",
        "Include trending technologies like Docker and Kubernetes",
        "Optimize for ATS with better keyword placement",
        "Add a professional summary section",
        "Include relevant certifications"
      ],
      strengths: [
        "Clear and professional format",
        "Strong educational background",
        "Relevant work experience",
        "Good use of action verbs",
        "Appropriate length for experience level"
      ]
    };
  };

  const analyzeResume = async () => {
    if (!selectedFile) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const result = mockAnalyzeResume();
      setAnalysis(result);
      setIsAnalyzing(false);
      toast.success("Resume analysis completed!");
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setJobDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadReport = () => {
    toast.success("Analysis report downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AI Resume Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Get instant feedback and ATS optimization suggestions
          </p>
        </div>

        {/* Upload Section */}
        <Card className="bg-gradient-card border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Upload Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Drop your resume here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF and Word documents
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description (Optional)</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description to get targeted keyword suggestions..."
                className="min-h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="hero"
                onClick={analyzeResume}
                disabled={isAnalyzing || !selectedFile}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={resetAnalysis}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-slide-in">
            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-success border-0 shadow-elegant text-accent-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{analysis.overallScore}%</div>
                  <Progress value={analysis.overallScore} className="mb-2" />
                  <p className="text-sm opacity-90">
                    {analysis.overallScore >= 80 ? "Excellent resume!" : 
                     analysis.overallScore >= 60 ? "Good with room for improvement" : 
                     "Needs significant improvements"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-primary border-0 shadow-elegant text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    ATS Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{analysis.atsScore}%</div>
                  <Progress value={analysis.atsScore} className="mb-2" />
                  <p className="text-sm opacity-90">
                    {analysis.atsScore >= 80 ? "ATS-friendly format!" : "Needs ATS optimization"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Section Breakdown */}
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Section Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analysis.sections).map(([section, data]) => (
                    <div key={section} className="space-y-3 p-4 bg-background/50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium capitalize">{section}</h3>
                        <Badge variant={data.score >= 80 ? "default" : data.score >= 60 ? "secondary" : "destructive"}>
                          {data.score}%
                        </Badge>
                      </div>
                      <Progress value={data.score} className="h-2" />
                      <ul className="text-xs space-y-1">
                        {data.feedback.slice(0, 2).map((item, index) => (
                          <li key={index} className="text-muted-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Keywords Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.present.map((keyword, index) => (
                      <Badge key={index} variant="default" className="bg-accent/10 text-accent border-accent/20">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.missing.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-card-custom">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-warning" />
                    Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="bg-gradient-card border-0 shadow-card-custom">
              <CardContent className="pt-6">
                <div className="flex gap-4 justify-center">
                  <Button variant="success" onClick={downloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="hero" onClick={() => toast.success("Feature coming soon!")}>
                    <Brain className="mr-2 h-4 w-4" />
                    AI Resume Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;