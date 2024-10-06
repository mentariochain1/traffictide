'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Star, CheckCircle, Circle } from 'lucide-react';
import styles from './TaskDetail.module.css';
import { getTelegramWebApp } from '../utils/telegramWebApp';

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
    // После завершения задачи можно вызвать onBack() для возврата к списку задач
    onBack();
  }, [onBack]);

  useEffect(() => {
    // Здесь должен быть запрос к API для получения деталей задачи
    // Для примера используем моковые данные
    setTask({
      id: taskId,
      title: 'Complete Profile',
      description: 'Fill out all the fields in your profile to earn points.',
      points: 100,
      subTasks: [
        { id: 1, description: 'Add profile picture', completed: true },
        { id: 2, description: 'Fill personal information', completed: false },
        { id: 3, description: 'Connect social media accounts', completed: false },
      ],
    });

    // Настройка кнопки "Назад" и Main Button
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
      // Скрываем кнопки при размонтировании компонента
      if (webApp) {
        webApp.BackButton.hide();
        webApp.BackButton.offClick(onBack);
        webApp.MainButton.hide();
        webApp.MainButton.offClick(handleCompleteTask);
      }
    };
  }, [taskId, onBack, handleCompleteTask]);

  if (!task) return null;

  const completedSubTasks = task.subTasks.filter(subTask => subTask.completed).length;
  const totalSubTasks = task.subTasks.length;
  const progress = (completedSubTasks / totalSubTasks) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.gradientOverlay}>
        <div className={styles.taskHeader}>
          <Star className={styles.taskIcon} size={48} />
          <h1 className={styles.taskTitle}>{task.title}</h1>
          <div className={styles.pointsBalance}>
            <Star className={styles.pointsIcon} size={16} />
            <span className={styles.pointsAmount}>{task.points}</span>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{task.description}</p>
        <div className={styles.subTasksContainer}>
          <h2 className={styles.subTasksTitle}>Subtasks</h2>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <ul className={styles.subTaskList}>
            {task.subTasks.map((subTask, index) => (
              <li key={subTask.id} className={`${styles.subTaskItem} ${subTask.completed ? styles.completed : ''}`}>
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;