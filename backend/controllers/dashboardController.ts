import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval   } from 'date-fns';

const prisma = new PrismaClient();

interface JwtPayload {
    id: number;
    // Add other fields if necessary
}
interface CustomUserRequest extends Request{
    user?: JwtPayload;
}
export const getProjectStatus = async (req: CustomUserRequest, res: Response) => {
    try{
        const user_id : number = req.user?.id ? req.user.id : 0;
        console.log("user id", user_id)
        const currentDate = new Date();

        const projectCountForUser = await prisma.project.count({
            where: {
                members: {
                    some: {
                        user_id
                    }
                }
            }
        });

        const completedProjectsCount = await prisma.project.count({
            where: {
                AND: [
                  {
                    tasks: {
                      some: {} // Ensures that the project has at least one task
                    }
                  },
                  {
                    tasks: {
                      every: {
                        phase_id: 5 // all tasks are completed
                      }
                    }
                  }
                ]
            }
        });

        const overdueProjectsCount = await prisma.project.count({
            where: {
                AND: [
                {
                    tasks: {
                        none: {
                            phase_id: 5
                        }
                    }
                },
                {
                    project_deadline_date: {
                        lt: currentDate
                    }
                }
                ]
            }
        });
        
        res.status(200).json({
            projectCountForUser,
            completedProjectsCount,
            overdueProjectsCount,
            inProgressProjectsCount : projectCountForUser - completedProjectsCount - overdueProjectsCount
        });
    }catch(err){
        console.log("Error at getProjectStatus: ", err);
        res.status(500).json({error: "Unable to fetch dashboard project status"});
    }
}

export const getCompletedProjectsAndTasks = async (req: CustomUserRequest, res: Response) => {
    try {
        const user_id: number = req.user ? req.user.id : 0;

        const today = new Date();
        const sevenDaysAgo = subDays(startOfDay(today), 6); // start from yesterday for a full 7 days range
    
        // Fetch completed projects grouped by date
        const completedProjectsByDate = await prisma.project.groupBy({
          by: ['project_updated_date'],
          where: {
            members: {
              some: {
                user_id
              }
            },
            project_updated_date: {
              gte: startOfDay(sevenDaysAgo),
              lte: endOfDay(today)
            },
            tasks: {
              every: {
                phase_id: 5
              }
            }
          },
          _count: {
            id: true
          },
          orderBy: {
            project_updated_date: 'asc'
          }
        });
    
        // Fetch completed tasks grouped by date
        const completedTasksByDate = await prisma.task.groupBy({
          by: ['task_updated_date'],
          where: {
            members: {
              some: {
                user_id
              }
            },
            task_updated_date: {
              gte: startOfDay(sevenDaysAgo),
              lte: endOfDay(today)
            },
            phase_id: 5
          },
          _count: {
            id: true
          },
          orderBy: {
            task_updated_date: 'asc'
          }
        });
    
        // Generate all dates for the past week
        const allDates = eachDayOfInterval({
          start: sevenDaysAgo,
          end: today
        });
    
        // Helper function to format date as 'yyyy-MM-dd'
        const formatDateOnly = (date: Date) => format(date, 'yyyy-MM-dd');
    
        // Format and map data to ensure all dates are included
        const formatData = (data: any[], dateField: string) => {
          // Create a map from the fetched data
          let dataMap = new Map();
          for(const date of data){
            const curDate = formatDateOnly(new Date(date[dateField]));
            if(dataMap.has(curDate)){
                dataMap.set(curDate, dataMap.get(curDate)+1);
            }else{
                dataMap.set(curDate, 1);
            }
          }
        //   const dataMap = new Map(data.map(item => [formatDateOnly(new Date(item[dateField])), item._count.id]));
          // Return all dates with counts
          return allDates.map(date => ({
            date: formatDateOnly(date),
            count: dataMap.get(formatDateOnly(date)) || 0
          }));
        };
    
        // Format data
        const formattedCompletedProjects = formatData(completedProjectsByDate, 'project_updated_date');
        const formattedCompletedTasks = formatData(completedTasksByDate, 'task_updated_date');
    
        res.status(200).json({
          completedProjects: formattedCompletedProjects,
          completedTasks: formattedCompletedTasks
        });
    } catch (err) {
      console.log("Error at getCompletedProjectsAndTasks : ", err);
      res.status(500).json({ error: 'Error retrieving completed projects and tasks' });
    }
}