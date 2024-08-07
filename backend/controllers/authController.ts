import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtHelper';

const prisma = new PrismaClient();

// Sign in a user
export const signInUser = async (req: Request, res: Response) => {
  const { user_email, user_password } = req.body;
  console.log(user_email, user_password)
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { user_email },
    });
    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error signing in' });
  }
};


// Create a new user
export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { user_name, user_email, user_password } = req.body;
    console.log(user_name, user_email, user_password)
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    const newUser = await prisma.user.create({
      data: {
        user_name,
        user_email,
        user_password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error at signUp: ", error)
    res.status(500).json({ error: 'Error creating user' });
  }
};