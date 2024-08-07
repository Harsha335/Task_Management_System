import { Request, Response } from 'express';
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
        // const projectIds = await prisma.projectMember.findMany({
        //     where: {
        //         user_id
        //     },
        //     select: {
        //         project_id: true
        //     }
        // }); 
        const projectDetails = await prisma.project.findMany({
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
            }
          });          
        console.log(projectDetails);
        res.status(200).json({projectDetails});
    }catch(err){
        console.log("Error at getProjectsByUserId : ", err);
        res.status(500).json({ error: 'Cannot get project of user' });
    }
}
