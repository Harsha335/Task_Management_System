import { Request, response, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const nodemailer = require('nodemailer');
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface JwtPayload {
    id: number;
    // Add other fields if necessary
}
interface CustomRequest extends Request {
    user?: JwtPayload;
}

// Create a new project
export const createProject = async (req: CustomRequest, res: Response) => {
    type reqBodyType = {
        project_title: string;
        project_description: string;
        project_deadline_date: Date;
        project_members: string[];
    }
    const { project_title, project_description, project_deadline_date, project_members } : reqBodyType = req.body ;

    try {
        // Create a project in the database
        const project = await prisma.project.create({
            data: {
                project_title,
                project_description,
                project_deadline_date: new Date(project_deadline_date) ,
            },
        });

        console.log(project, req.user?.id);
        const project_id : number = project.id;
        const user_id : number = req.user ? req.user.id : 0;

        await prisma.projectMember.create({
            data: {
                project_id,
                user_id,
                role: 'ADMIN',
            },
        });
        console.log('ADMIN projectMember added');

        // // Send invitation emails to project members
        const promiseArray = project_members.map(memberEmail => {
            console.log('Sending invitation to ', memberEmail);
            return sendInvitationEmail(memberEmail, project.id); // Ensure this returns a promise
        });
        console.log(promiseArray)
        // Wait for all promises to resolve
        await Promise.all(promiseArray);

        res.status(201).json({ message: 'Project created successfully!', project });
    }  catch (error) {
    console.log("Error at CreateProject : ",error);
    res.status(500).json({ error: 'Error creating project' });
  }
};

const sendInvitationEmail = async (email: string, projectId: number) => {
    // Check if the user exists
    let user = await prisma.user.findUnique({ where: { user_email: email } });
    console.log("invite : ",user)
    if (!user) {
        // If the user does not exist, create an account for them
        const hashedPassword = await bcrypt.hash('12345', 10);
        user = await prisma.user.create({
            data: {
                user_name: email.split('@')[0],
                user_email: email,
                user_password: hashedPassword, // Set a temporary password
            },
        });
        console.log("new user created")
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
    //   console.log(transporter);

    const acceptLink = `${process.env.SERVER_URL}/api/project/accept?projectId=${projectId}&userId=${user.id}`;
    const declineLink = `${process.env.SERVER_URL}/api/project/decline?projectId=${projectId}&userId=${user.id}`;

    // Send the invitation email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Project Invitation',
        html: `
            <p>Hello,</p>
            <p>You have been invited to a project.</p>
            <p>If you don't have an account, a temporary account has been created for you with the following credentials:</p>
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <div><strong>Username:</strong> ${email.split('@')[0]}</div>
                <div><strong>Email:</strong> ${email}</div>
                <div><strong>Temporary Password:</strong> 12345</div>
            </div>
            <p>Please <a href="${acceptLink}">accept</a> or <a href="${declineLink}">decline</a> the invitation.</p>
            <p>Best regards,<br>Your Team</p>
        `,
    });
};

interface QueryType {
    projectId?: string;
    userId?: string;
}

interface CustomAcceptRequest extends Request {
    query: any;
}

export const acceptInvitation = async (req: CustomAcceptRequest, res: Response) => {
    const { projectId, userId } = req.query;
    console.log("user accepted request: ", projectId, userId);
    // Ensure both projectId and userId are provided and are valid numbers
    if (!projectId || !userId || isNaN(Number(projectId)) || isNaN(Number(userId))) {
        return res.status(400).json({ error: 'Invalid projectId or userId' });
    }

    try {
        // Add the user to the project as a member
        await prisma.projectMember.create({
            data: {
                project_id: parseInt(projectId, 10),
                user_id: parseInt(userId, 10),
                role: 'MEMBER', // or 'ADMIN' based on your logic
            },
        });

        res.status(200).json({ message: 'You have joined the project successfully!' });
    } catch (err) {
        console.error('Error accepting invitation:', err);
        res.status(500).json({ error: 'Error accepting invitation' });
    }
};

export const declineInvitation = (req: Request, res: Response) => {
    // Implement logic if needed
    res.status(200).json({ message: 'You have declined the invitation.' });
};

export const getProjectsByUserId = async (req: CustomRequest, res: Response) => {
    try{
        const user_id : number = req.user ? req.user.id : 0;
        const projects = await prisma.project.findMany({
            where: {
                members: {
                  some: {   // Ensure at least one related ProjectMember matches the condition
                    user_id
                  }
                }
              },
            include: {
              members: {    // ProjectMembers
                include: {
                  user: {
                    select: {
                      user_name: true,
                      user_email: true
                    }
                  }
                }
              },
              tasks: true
            },
          });     
          // Calculate project status for each project
          const projectDetails = projects.map(project => {
            // Count the number of tasks in phase_id = 5
            const completedTasksCount = project.tasks.filter(task => task.phase_id === 5).length;
            // Total number of tasks
            const totalTasksCount = project.tasks.length;
            // Calculate project status
            const projectStatus = totalTasksCount === 0 ? 0 : (completedTasksCount / totalTasksCount) * 100;

            return {
                ...project,
                projectStatus: projectStatus.toFixed(2) // Converts to percentage
            };
        });     
        res.status(200).json({projectDetails});
    }catch(err){
        console.log("Error at getProjectsByUserId : ", err);
        res.status(500).json({ error: 'Cannot get project of user' });
    }
}

interface CustomProjectRequest extends Request {
    query : any;
}

export const getProjectMembers = async (req: CustomProjectRequest, res: Response) => {
    try {
        const projectId = req.query.projectId;
        // Ensure projectId is provided and is valid number
        if (!projectId || isNaN(Number(projectId))) {
            return res.status(400).json({ error: 'Invalid projectId ' });
        }
      const projectWithMembers = await prisma.project.findUnique({
        where: { id: parseInt(projectId, 10) },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  user_name: true,
                  user_email: true
                }
              }
            }
          }
        }
      });
  
      const ProjectMembers = projectWithMembers?.members.map(member => ({
        userId: member.user.id,
        userName: member.user.user_name,
        userEmail: member.user.user_email,
        role: member.role
      }));
    //   console.log("ProjectMembers ",ProjectMembers);
      res.status(200).json({ProjectMembers});
    } catch (error) {
        console.log("Error fetching project members : ", error);
        res.status(500).json({ error: 'Cannot get members of a project'});
    }
};

export const getPhaseList = async (req: Request, res: Response) => {
    try {
        const phaseList = await prisma.phase.findMany();
        console.log(phaseList);
        res.status(200).json({phaseList});
    } catch (error) {
        console.log("Error fetching phase list : ", error);
        res.status(500).json({ error: 'Cannot get phases of a project'});
    }
};

export const getAllTasks = async (req: CustomProjectRequest, res: Response) => {
    try {
        const projectId = req.query.projectId;
        // Ensure projectId is provided and is valid number
        if (!projectId || isNaN(Number(projectId))) {
            return res.status(400).json({ error: 'Invalid projectId ' });
        }
        const tasks = await prisma.phase.findMany({
            include: {
                tasks: {
                  where: {
                    project_id: parseInt(projectId, 10)
                  },
                  include: {
                    members: {  //TaskMembers
                      include: {
                        user: {
                          select: {
                            id: true,
                            user_name: true,
                            user_email: true
                          }
                        }
                      }
                    },
                    items: true //TaskItems
                  }
                }
              }
        });
        console.log(tasks);
        res.status(200).json({tasks});
    } catch (error) {
        console.log("Error fetching allTasks : ", error);
        res.status(500).json({ error: 'Cannot get tasks of a project'});
    }
}

// interface CustomTaskRequest {
//     query : any;
// }

// export const getTaskMembers = async (req: CustomTaskRequest, res: Response) => {
//     try{

//     }catch(err){
//         console.log("Error fetching getTaskMembers : ", err);
//         res.status(500).json({ error: 'Cannot get tasks of a project'});
//     }
// }


export const createTask = async ( req: CustomProjectRequest, res: Response) => {
    try{
        const {projectId, phaseId} = req.query;
        // Ensure projectId is provided and is valid number
        if (!projectId || isNaN(Number(projectId)) || !phaseId || isNaN(Number(phaseId))) {
            return res.status(400).json({ error: 'Invalid projectId or phaseId' });
        }
        // parseInt(projectId, 10)
        const { task_title, task_description} = req.body;
        const newTask = await prisma.task.create({
            data: {
                task_title, 
                task_description,
                priority: 'LOW',
                project_id: parseInt(projectId, 10),
                phase_id: parseInt(phaseId, 10),
                task_deadline_date: new Date(),
            }
        });
        res.status(201).json({newTask});
    }catch(err) {
        console.log("Error in Create task : ", err);
        res.status(500).json({error: "Error in creating a task "});
    }
}

interface CustomTaskRequest extends Request {
  user?: JwtPayload;
  query : any;
}

export const joinTask = async (req : CustomTaskRequest, res: Response) => {
  try{
    console.log("Joining task...")
    const user_id = req.user?.id ? req.user.id : 0;
    const {taskId} = req.query;
    // Check if the task member already exists
    const existingTaskMember = await prisma.taskMember.findFirst({
      where: {
        user_id: user_id,
        task_id: parseInt(taskId as string, 10),
      },
    });

    if (existingTaskMember) {
      // If the task member already exists, do nothing and send a message
      console.log("User is already a member of this task.");
      return res.status(409).json({ error: "User is already a member of this task." });
    }
    
    await prisma.taskMember.create({
      data: {
        user_id,
        task_id: parseInt(taskId, 10)
      }
    });
    console.log("Joined task.")
    const user = await prisma.user.findFirst({
      where:{
        id: user_id
      }
    })
    res.status(201).json({user});
  }catch(err){
    console.log("Error in Join task : ", err);
    res.status(500).json({error: "Error in joining a task "});
  }
}

export const updateTask = async (req: CustomProjectRequest, res: Response) => {
  try{
    type TaskItem = {
      id?: number;
      task_id?: number;
      item_title?: string;
      is_completed?: boolean;
    };
    const {priority,task_deadline_date} = req.body;
    const items: TaskItem[] = req.body.items;
    const {taskId} = req.query;
    await prisma.task.update({
      where:{
        id: parseInt(taskId, 10)
      },
      data:{
        priority,
        task_deadline_date
      }
    });
    if(items){
      // for update items
      const operations = items.map((item: TaskItem) => {
        if (item.id) {
          // If id is present, update the existing item
          return prisma.taskItem.update({
            where: { id: item.id },
            data: {
              item_title: item.item_title,
              is_completed: item.is_completed,
            },
          });
        } else {
          // If no id, create a new item
          return prisma.taskItem.create({
            data: {
              task_id: item.task_id || 0,
              item_title: item.item_title || "",
              is_completed: item.is_completed || false,
            },
          });
        }
      });
      await Promise.all(operations);
    }
    res.status(200).json({message: "Task updated successfully"});
  }catch(err){
    console.log("Error at updateTask: ", err);
    res.status(500).json({error: "Error in updating a task"});
  }
}

export const swapTask = async (req: Request, res: Response) => {
  try{
    const {task_id, phase_id} = req.body;
    
    const resp = await prisma.task.update({
      where:{
        id: task_id
      },
      data: {
        phase_id
      }
    });
    console.log(resp);
    res.status(200).json({message: "Updated task phase successfully"});
  }catch(err){
    console.log("Error at swapTask: ", err);
    res.status(500).json({error: "Error in swaping a task b/n phases"});
  }
}