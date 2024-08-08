// import { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import ItemsColumn from "./ItemsColumn";
import StrictModeDroppable from "./Dragable";

// interface ITodoItem {
//   id: number;
//   task_title: string;
// }
// interface ColumnItem {
//     id: number;
//     phase_title: string;
//     tasks: ITodoItem[];
// }

// const initialTodoItems = [
//     {
//       id: 1,
//       task_title: "Go for a walk",
//     },
//     {
//       id: 2,
//       task_title: "Take a nap",
//     },
//     {
//       id: 3,
//       task_title: "Read a book",
//     },
//     {
//       id: 4,
//       task_title: "Work out",
//     },
//     {
//       id: 5,
//       task_title: "Learn something new",
//     },
// ];
  
// const initialAllTasks = {
//     todoColumn: {
//       id: 1,
//       phase_title: "To do",
//       tasks: [...initialTodoItems],
//     },
//     doneColumn: {
//       id: 2,
//       phase_title: "Done",
//       tasks: [],
//     },
// };

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

const reorder = ( list: Task[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// type ColumnType = { [key: string]: ColumnItem };



const ProjectBoard  = ({allPhaseTask, setAllPhaseTask, projectId} : {allPhaseTask: allPhaseTaskType[]; setAllPhaseTask: React.Dispatch<React.SetStateAction<allPhaseTaskType[]>>; projectId: number}) => {
  // const [allTasks, setAllTasks] = useState<ColumnType>(initialallTasks);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceSectionId = source.droppableId;
    const destSectionId = destination?.droppableId;

    if(!destSectionId){
      return;
    }

    // REORDER: if source and destination droppable ids are same
    if (sourceSectionId === destSectionId) {
      const column = allPhaseTask.filter(phaseTask => phaseTask.id.toString() === sourceSectionId)[0];
      const reorderedItems = reorder(
        column.tasks,
        source.index,
        destination.index
      );

      setAllPhaseTask(allPhaseTask => ({
        ...allPhaseTask,
        [destSectionId]: {
          ...column,
          tasks: reorderedItems,
        },
      }));
    }
    else{
      const sourceColumn = allPhaseTask.filter(phaseTask => phaseTask.id.toString() === sourceSectionId)[0];
      const desColumn = allPhaseTask.filter(phaseTask => phaseTask.id.toString() === destSectionId)[0];

      const taskToDrop = sourceColumn.tasks.find(
        (task) => task.id.toString() == result.draggableId
      );

      //INSERT: dragged item to another column
      if (taskToDrop) {
        const sourceColumnItems = Array.from(sourceColumn.tasks);
        const destColumnItems = Array.from(desColumn.tasks);

        sourceColumnItems.splice(result.source.index, 1);
        destColumnItems.splice(result.destination.index, 0, taskToDrop);

        setAllPhaseTask({
          ...allPhaseTask,
          [sourceSectionId]: {
            ...sourceColumn,
            tasks: sourceColumnItems,
          },
          [destSectionId]: {
            ...desColumn,
            tasks: destColumnItems,
          },
        });
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-row gap-3 w-full p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {allPhaseTask.map((phase) => (
            <StrictModeDroppable droppableId={phase.id.toString()} key={phase.id}>
              {(provided) => (
                <div className="flex-1" {...provided.droppableProps} ref={provided.innerRef}>
                  <ItemsColumn
                    columnTitle={phase.phase_title}
                    phaseId = {phase.id}
                    tasks={phase.tasks}
                    projectId={projectId}
                  />
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ProjectBoard;