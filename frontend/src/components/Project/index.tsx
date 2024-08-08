import { useParams } from 'react-router-dom';
import ProjectBoard from './DragAndDrop/ProjectBoard';
import { useEffect, useState } from 'react';
import axiosTokenInstance from '../../api_calls/api_token_instance';
import UserAvathar from '../../ui_components/UserAvathar';

const Project: React.FC = () => {
  const {projectId} = useParams();

  type projectMembersType = {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
  }
  const [projectMembers, setProjectMembers] = useState<projectMembersType[]>([]);

  type phaseListType = {
    id: number;
    phase_title: string;
  }
  const [phaseList, setPhaseList] = useState<phaseListType[]>([]);  // -- TODO: no need i THINK remove ---






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
  task_completed_date: Date;
  
  members: TaskMember[];
  items: TaskItem[];
};

 type allPhaseTaskType = {
  id: number;
  phase_title: string;
  tasks: Task[];
};

// Define the type for the data returned by your query
//  type allTaskType = Phase & {
//   tasks: Array<Task & {
//     members: Array<TaskMember & {
//       user: User;
//     }>;
//     items: TaskItem[];
//   }>;
// };
  // [{ id: 1, phase_title: 'Backlog', tasks: [] }]
  const [allPhaseTask, setAllPhaseTask] = useState<allPhaseTaskType[]>([]);

  useEffect(() => {
    const getProjectMembers = async () => {
      try{
        const response = await axiosTokenInstance.get(`/api/project/projectMembers?projectId=${projectId}`);
        // console.log(response.data.ProjectMembers)
        setProjectMembers(response.data.ProjectMembers)
      }catch(err){
        console.log("Error at getProjectMembers : ",err);
      }
    }
    const getPhaseList = async () => {
      try{
        const response = await axiosTokenInstance.get('/api/project/phaseList');
        // console.log(response.data.phaseList);
        setPhaseList(response.data.phaseList);
      }catch(err){
        console.log("Error at getPhaseList: ", err);
      }
    }
    const getAllTasks = async () => {
      try{
        const response = await axiosTokenInstance.get(`/api/project/allTasks?projectId=${projectId}`);
        console.log(response.data.tasks);
        setAllPhaseTask(response.data.tasks);
      }catch(err){
        console.log("Error at getAllTasks: ", err);
      }
    }
    getProjectMembers();
    getPhaseList();
    getAllTasks();
  },[]);
  return (
    <div className="flex flex-col h-screen">
      {/* TODO : Navbar */}
        <div>{projectMembers.map((member) => (
          <li>
            userName : {member.userName}
          </li>
        ))}</div>
        
        <div>
            <ProjectBoard allPhaseTask={allPhaseTask} setAllPhaseTask={setAllPhaseTask} projectId={projectId ? parseInt(projectId, 10) : 0}/>
        </div>
    </div>
  )
}

export default Project