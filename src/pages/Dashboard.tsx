import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart3, Brain, FileText, Trophy, TrendingUp, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIConfiguration from "@/components/AIConfiguration";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    totalInterviews: 12,
    averageScore: 87,
    resumeScore: 92,
    improvementTrend: 15
  });

  const recentSessions = [
    { id: 1, role: "Software Engineer", score: 89, date: "2024-01-20", type: "Technical" },
    { id: 2, role: "Product Manager", score: 85, date: "2024-01-19", type: "Behavioral" },
    { id: 3, role: "Data Scientist", score: 91, date: "2024-01-18", type: "Technical" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Interview Progress Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your improvement and master your interview skills
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Application Settings</DialogTitle>
              </DialogHeader>
              <AIConfiguration />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalInterviews}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Brain className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resume Score</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.resumeScore}%</div>
              <p className="text-xs text-muted-foreground">Excellent rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card-custom hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">+{stats.improvementTrend}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Continue your interview preparation journey
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="h-16"
              onClick={() => navigate("/interview")}
            >
              <Brain className="mr-2 h-5 w-5" />
              Start New Interview
            </Button>
            <Button 
              variant="success" 
              size="lg" 
              className="h-16"
              onClick={() => navigate("/resume")}
            >
              <FileText className="mr-2 h-5 w-5" />
              Analyze Resume
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-16 hover:bg-primary/5"
              onClick={() => navigate("/")}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Interview Sessions
            </CardTitle>
            <CardDescription>
              Your latest practice sessions and scores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                <div className="space-y-1">
                  <div className="font-medium">{session.role}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Badge variant={session.type === "Technical" ? "default" : "secondary"}>
                      {session.type}
                    </Badge>
                    <span>{session.date}</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-primary">{session.score}%</div>
                  <Progress value={session.score} className="w-20" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;