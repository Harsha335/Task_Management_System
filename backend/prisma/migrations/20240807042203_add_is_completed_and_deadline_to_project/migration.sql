/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Project` table. All the data in the column will be lost.
  - Added the required column `task_completed_date` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "isCompleted",
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "task_completed_date" TIMESTAMP(3) NOT NULL;
