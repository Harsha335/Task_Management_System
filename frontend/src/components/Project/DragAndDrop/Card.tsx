import { toZonedTime, format as formatZoned } from 'date-fns-tz';
import { Draggable } from "react-beautiful-dnd";
import TimerIcon from '@mui/icons-material/Timer';
import { useState } from "react";
import TaskPopup from "../TaskPopup";
import UserAvathar from '../../../ui_components/UserAvathar';


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

interface CardProps {
  id: number;
  task: Task;
  draggableId: string;
  index: number;
  phaseId: number;
  projectId: number;
}

const Card = ({ task, draggableId, index, projectId, phaseId }: CardProps) => {
  const taskPriorityColors: any  = {
    LOW : "bg-secondary text-white",
    MEDIUM : "bg-warning-light text-white",
    HIGH : "bg-error text-white",
  }

  const timeConverter = (value : Date) => {
      const istDate = toZonedTime(value, 'Asia/Kolkata');
      return formatZoned(istDate, 'yyyy-MM-dd', { timeZone: 'Asia/Kolkata' });
  }

  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const handleTaskPopup = () => {
    setOpenPopup(isOpen => !isOpen);
  }
  return (
    <>
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${
            snapshot.isDragging ? "bg-gray-100" : "bg-white"
          } px-2 py-4 font-medium w-full min-h-24 shadow-md shadow-slate-300 rounded-md flex flex-col gap-5`}
          onClick={() => handleTaskPopup()}
        >
          <div className="flex flex-row justify-between">
            <span>{task.task_title}</span>
            <span >
              <span className={`px-2 py-1 ${taskPriorityColors[task.priority]} text-sm rounded-md`}>{task.priority}</span>
            </span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="border-2 p-1 bg-slate-300"><TimerIcon/> {timeConverter(task.task_deadline_date)}</span>
            <UserAvathar maxUsersCount={5} users={task.members.map((member: any) => ({'name': member.user.user_name, 'email':member.user.user_email}))}/>
            {/* <span className={`px-2 py-1 ${taskPriorityColors[task.priority]}  text-sm rounded-lg`}>{task.members.}</span> */}
          </div>
        </div>
      )}
    </Draggable>
    {openPopup && <TaskPopup projectId={projectId} phaseId={phaseId} handleTaskPopup={handleTaskPopup} task={task}/>}
    </>
  );
};

export default Card;