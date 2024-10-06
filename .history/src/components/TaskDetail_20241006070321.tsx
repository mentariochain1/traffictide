'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Star, CheckCircle, Circle } from 'lucide-react';
import { getTelegramWebApp } from '@/utils/telegramWebApp';
import styles from './TaskDetail.module.css';

interface SubTask {
  id: number;
  description: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  subTasks: SubTask[];
}

interface TaskDetailProps {
  taskId: number;
  onBack: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<Task | null>(null);

  const handleCompleteTask = useCallback(() => {
    // Здесь должна быть логика завершения задачи
    console.log('Task completed');
    onBack();
  }, [onBack]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      // Здесь должен быть запрос к API для получения деталей задачи
      // Для примера используем моковые данные
      const mockTask: Task = {
        id: taskId,
        title: 'Complete Profile',
        description: 'Fill out all the fields in your profile to earn points.',
        points: 100,
        subTasks: [
          { id: 1, description: 'Add profile picture', completed: true },
          { id: 2, description: 'Fill personal information', completed: false },
          { id: 3, description: 'Connect social media accounts', completed: false },
        ],
      };
      setTask(mockTask);
    };

    fetchTaskDetails();

    const webApp = getTelegramWebApp();
    if (webApp) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onBack);

      webApp.MainButton.text = "Complete Task";
      webApp.MainButton.color = "#FFFFFF";
      webApp.MainButton.textColor = "#000000";
      webApp.MainButton.show();
      webApp.MainButton.onClick(handleCompleteTask);
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(onBack);
        webApp.MainButton.hide();
        webApp.MainButton.offClick(handleCompleteTask);
      }
    };
  }, [taskId, onBack, handleCompleteTask]);

  const { completedSubTasks, totalSubTasks, progress } = useMemo(() => {
    if (!task) return { completedSubTasks: 0, totalSubTasks: 0, progress: 0 };
    const completedSubTasks = task.subTasks.filter(subTask => subTask.completed).length;
    const totalSubTasks = task.subTasks.length;
    const progress = (completedSubTasks / totalSubTasks) * 100;
    return { completedSubTasks, totalSubTasks, progress };
  }, [task]);

  if (!task) return null;

  return (
    <div className={styles.container}>
      <div className={styles.gradientOverlay}>
        <TaskHeader title={task.title} points={task.points} />
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{task.description}</p>
        <SubTasksSection 
          subTasks={task.subTasks} 
          completedSubTasks={completedSubTasks} 
          totalSubTasks={totalSubTasks} 
          progress={progress} 
        />
      </div>
    </div>
  );
};

interface TaskHeaderProps {
  title: string;
  points: number;
}

const TaskHeader: React.FC<TaskHeaderProps> = React.memo(({ title, points }) => (
  <div className={styles.taskHeader}>
    <Star className={styles.taskIcon} size={48} />
    <h1 className={styles.taskTitle}>{title}</h1>
    <div className={styles.pointsBalance}>
      <Star className={styles.pointsIcon} size={16} />
      <span className={styles.pointsAmount}>{points}</span>
    </div>
  </div>
));

TaskHeader.displayName = 'TaskHeader';

interface SubTasksSectionProps {
  subTasks: SubTask[];
  completedSubTasks: number;
  totalSubTasks: number;
  progress: number;
}

const SubTasksSection: React.FC<SubTasksSectionProps> = React.memo(({ 
  subTasks, progress 
}) => (
  <div className={styles.subTasksContainer}>
    <h2 className={styles.subTasksTitle}>Subtasks</h2>
    <div className={styles.progressBar}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
    </div>
    <ul className={styles.subTaskList}>
      {subTasks.map((subTask, index) => (
        <SubTaskItem key={subTask.id} subTask={subTask} index={index} />
      ))}
    </ul>
  </div>
));

SubTasksSection.displayName = 'SubTasksSection';

interface SubTaskItemProps {
  subTask: SubTask;
  index: number;
}

const SubTaskItem: React.FC<SubTaskItemProps> = React.memo(({ subTask, index }) => (
  <li className={`${styles.subTaskItem} ${subTask.completed ? styles.completed : ''}`}>
    <span className={styles.subTaskNumber}>{index + 1}</span>
    <div className={styles.subTaskContent}>
      <span className={styles.subTaskDescription}>{subTask.description}</span>
      <span className={styles.subTaskStatus}>
        {subTask.completed ? (
          <CheckCircle className={styles.completedIcon} size={20} />
        ) : (
          <Circle className={styles.incompleteIcon} size={20} />
        )}
      </span>
    </div>
  </li>
));

SubTaskItem.displayName = 'SubTaskItem';

export default TaskDetail;