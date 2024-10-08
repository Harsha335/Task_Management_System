import { useState } from "react";
import Card from "./Card";

import CreateTaskPopup from "../CreateTaskPopup";

type User = {
  id: number;
  user_name: string;
  user_email: string;
};

 type TaskItem = {
  id: number;
  task_id: number;
  item_title: string;
  is_completed: boolean;
};

 type TaskMember = {
  task_id: number;
  user_id: number;
  user: User;
};

// Enum for task priority
enum Priority {
  HIGH,
  MEDIUM,
  LOW
}

 type Task = {
  id: number;
  task_title: string;
  task_description: string;
  priority: Priority;
  phase_id: number;
  project_id: number;
  task_deadline_date: Date;
  task_updated_date: Date;
  
  members: TaskMember[];
  items: TaskItem[];
};

interface tasksColumnProps {
  columnTitle: string;
  tasks: Task[];
  projectId: number;
  phaseId: number;
}

const ItemsColumn = ({ columnTitle, tasks, projectId, phaseId }: tasksColumnProps) => {

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const handleCreateTaskPopup = () => {
    setOpenPopup(isOpen => !isOpen);
  }

  return (
    <div
      className="min-h-48 scrollbar-thin scrollbar-thumb-blue-700 
    scrollbar-track-blue-300 overflow-y-auto
      p-4 rounded-md border-2 border-slate-300 shadow-inner bg-slate-100 flex flex-col justify-between"
    >
      <div>
        <p className="inline-block py-1 px-2 text-lg font-semibold ">
          {columnTitle}
        </p>
        <div className=" pt-4 flex flex-col gap-y-3">
          {tasks && tasks.length > 0 &&
            tasks.map((task, index) => (
              <Card
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
                task={task}
                id={task.id}
                projectId={projectId}
                phaseId={phaseId}
              />
            ))}
        </div>
      </div>
      <div className="mt-2">
        <button className="bg-primary text-white rounded-md p-2" onClick={() => handleCreateTaskPopup()}>+ Add a Task</button>
      </div>
      {openPopup && <CreateTaskPopup handleCreateTaskPopup={handleCreateTaskPopup} projectId={projectId} phaseId={phaseId}/>}
    </div>
  );
};

export default ItemsColumn;