import { useParams } from 'react-router-dom';
import ProjectBoard from './DragAndDrop/ProjectBoard';
import { useEffect, useState } from 'react';
import axiosTokenInstance from '../../api_calls/api_token_instance';
import UserAvathar from '../../ui_components/UserAvathar.js';

const Project: React.FC = () => {
  const {projectId} = useParams();

  type projectMembersType = {
    userId: number;
    userName: string;
    userEmail: string;
    role: string;
  }
  const [projectMembers, setProjectMembers] = useState<projectMembersType[]>([]);

  // type phaseListType = {
  //   id: number;
  //   phase_title: string;
  // }
  // const [phaseList, setPhaseList] = useState<phaseListType[]>([]);  // -- TODO: no need i THINK remove ---






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

  const [allPhaseTask, setAllPhaseTask] = useState<allPhaseTaskType[]>([]);
  const [searchedAllPhaseTask, setSearchedAllPhaseTask] = useState<allPhaseTaskType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  useEffect(() => {
    if(!searchTerm)
    {
      setSearchedAllPhaseTask(allPhaseTask);
      return;
    }
    const handler = setTimeout(() => {
      const filteredTasks = allPhaseTask.map(phase => ({
        ...phase,
        tasks: phase.tasks.filter(task =>
          task.task_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }));
      setSearchedAllPhaseTask(filteredTasks)
    }, 300);

    return () => {
      clearTimeout(handler);
    };    
  },[searchTerm]);

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
    // const getPhaseList = async () => {
    //   try{
    //     const response = await axiosTokenInstance.get('/api/project/phaseList');
    //     // console.log(response.data.phaseList);
    //     setPhaseList(response.data.phaseList);
    //   }catch(err){
    //     console.log("Error at getPhaseList: ", err);
    //   }
    // }
    const getAllTasks = async () => {
      try{
        const response = await axiosTokenInstance.get(`/api/project/allTasks?projectId=${projectId}`);
        console.log(response.data.tasks);
        setAllPhaseTask(response.data.tasks);
        setSearchedAllPhaseTask(response.data.tasks);
      }catch(err){
        console.log("Error at getAllTasks: ", err);
      }
    }
    getProjectMembers();
    // getPhaseList();
    getAllTasks();
  },[]);
  return (
    <div className="flex flex-col h-screen">
      <div className='bg-primary-light p-2 flex flex-row justify-between'>
        <input type="text" placeholder='Search Tasks.. ' className='p-2 border-2 border-slate-200 rounded-lg w-72' value={searchTerm} onChange={handleSearchChange} />
        <div className='flex flex-row gap-5 items-center'>
          {/* TODO : Filter by priority */}
          <span>Filter</span>
          <UserAvathar maxUsersCount={5} users={projectMembers.map((member: any) => ({'name': member.userName, 'email':member.userEmail}))}/>
            {/* TODO : Mark as project completed (THINK ONCE ABOUT REMOVE project -> is_completed and autoUpdate - completedDate)*/}
            <button>Mark as Complete</button>
        </div>
      </div>
        <div>
            <ProjectBoard allPhaseTask={searchedAllPhaseTask} setAllPhaseTask={setAllPhaseTask} projectId={projectId ? parseInt(projectId, 10) : 0}/>
        </div>
    </div>
  )
}

export default Project;