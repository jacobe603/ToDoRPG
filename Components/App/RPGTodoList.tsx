'use client'
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sword, Heart, Coins, Star } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gold: number;
  timeLimit: number;
  createdAt: Date;
  completed: boolean;
}

interface PlayerStats {
  health: number;
  gold: number;
  exp: number;
  level: number;
}

interface NewTask {
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gold: number | string;
  timeLimit: number | string;
}

const RPGTodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    name: '',
    difficulty: 'easy',
    gold: '',
    timeLimit: '',
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    health: 100,
    gold: 0,
    exp: 0,
    level: 1
  });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Date.now(),
      name: newTask.name,
      difficulty: newTask.difficulty,
      gold: Number(newTask.gold),
      timeLimit: Number(newTask.timeLimit),
      createdAt: new Date(),
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask({ name: '', difficulty: 'easy', gold: '', timeLimit: '' });
  };

  const completeTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const timeTaken = (new Date().getTime() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60); // hours
    
    let expGained = 0;
    switch(task.difficulty) {
      case 'easy': expGained = 10; break;
      case 'medium': expGained = 20; break;
      case 'hard': expGained = 30; break;
    }

    if (timeTaken <= task.timeLimit) {
      setPlayerStats(prev => ({
        ...prev,
        gold: prev.gold + task.gold,
        exp: prev.exp + expGained,
        level: Math.floor((prev.exp + expGained) / 100) + 1
      }));
    } else {
      setPlayerStats(prev => ({
        ...prev,
        health: Math.max(0, prev.health - 10)
      }));
    }

    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-mono">
      <div className="mb-8 p-4 bg-gray-800 text-green-400 rounded">
        <pre className="text-center text-xl mb-4">
          {`
    _____  _____   _____   _____          _      
   |  __ \\|  __ \\ / ____| |_   _|   /\\   | |     
   | |__) | |__) | |  __    | |    /  \\  | |     
   |  _  /|  ___/| | |_ |   | |   / /\\ \\ | |     
   | | \\ \\| |    | |__| |  _| |_ / ____ \\| |____ 
   |_|  \\_\\_|     \\_____| |_____|_/    \\_\\______|
          `}
        </pre>
        
        <div className="flex justify-between items-center text-lg">
          <div><Heart className="inline mr-2" /> HP: {playerStats.health}</div>
          <div><Coins className="inline mr-2" /> Gold: {playerStats.gold}</div>
          <div><Star className="inline mr-2" /> Level: {playerStats.level}</div>
          <div><Sword className="inline mr-2" /> EXP: {playerStats.exp}</div>
        </div>
      </div>

      <Card className="p-4 mb-4 bg-gray-800 text-green-400">
        <form onSubmit={addTask} className="space-y-4">
          <div className="flex flex-col">
            <label>Quest Name:</label>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
              className="bg-gray-700 p-2 rounded text-green-400"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label>Difficulty:</label>
              <select
                value={newTask.difficulty}
                onChange={(e) => setNewTask({...newTask, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                className="w-full bg-gray-700 p-2 rounded text-green-400"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex-1">
              <label>Gold Reward:</label>
              <input
                type="number"
                value={newTask.gold}
                onChange={(e) => setNewTask({...newTask, gold: e.target.value})}
                className="w-full bg-gray-700 p-2 rounded text-green-400"
                required
              />
            </div>

            <div className="flex-1">
              <label>Time Limit (hours):</label>
              <input
                type="number"
                value={newTask.timeLimit}
                onChange={(e) => setNewTask({...newTask, timeLimit: e.target.value})}
                className="w-full bg-gray-700 p-2 rounded text-green-400"
                required
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Add Quest
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 bg-gray-800 text-green-400">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{task.name}</h3>
                <p>Difficulty: {task.difficulty}</p>
                <p>Reward: {task.gold} gold</p>
                <p>Time Limit: {task.timeLimit} hours</p>
              </div>
              <Button
                onClick={() => completeTask(task.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete Quest
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RPGTodoList;