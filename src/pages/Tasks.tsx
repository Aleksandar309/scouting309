"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PlusCircle, CalendarDays, Briefcase, CheckCircle, CircleDotDashed } from 'lucide-react';
import { Task, TaskStatus } from '@/types/task';
import { Scout } from '@/types/scout';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';
import { Badge } from '@/components/ui/badge';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { getPriorityBadgeClass, getStatusBadgeClass, getDueDateStatus } from '@/utils/task-utils';

interface TasksPageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  scouts: Scout[];
}

const TasksPage: React.FC<TasksPageProps> = ({ tasks, setTasks, scouts }) => {
  const navigate = useNavigate();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsTaskFormOpen(false);
  };

  const handleMarkAsComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Completed" } : task
      )
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const aOverdue = a.status !== "Completed" && isPast(new Date(a.dueDate));
    const bOverdue = b.status !== "Completed" && isPast(new Date(b.dueDate));

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (a.status !== "Completed" && b.status === "Completed") return -1;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-16"> {/* Added pt-16 */}
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Scouting Tasks ({tasks.length})</h1>
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
              </Button>
            </DialogTrigger>
            <TaskForm onAddTask={handleAddTask} onClose={() => setIsTaskFormOpen(false)} scouts={scouts} />
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedTasks.length === 0 ? (
            <Card className="bg-card border-border text-card-foreground text-center p-8 lg:col-span-2">
              <CardTitle className="text-xl mb-4">No Tasks Yet!</CardTitle>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start by creating a new scouting task for your team.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedTasks.map((task) => (
              <Card key={task.id} className={cn(
                "bg-card border-border text-card-foreground shadow-sm",
                task.status === "Completed" && "opacity-70 border-green-500",
                task.status === "Overdue" && "border-destructive"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{task.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityBadgeClass(task.priority)}>{task.priority}</Badge>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">{task.type}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-1" /> Assigned to: <Link to={`/scouts/${task.assignedTo}`} className="text-primary hover:underline ml-1">{task.assignedToName}</Link>
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground text-sm">
                  <p>{task.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" /> Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      {getDueDateStatus(task.dueDate, task.status)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusBadgeClass(task.status)}>{task.status}</Badge>
                      {task.status !== "Completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsComplete(task.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;