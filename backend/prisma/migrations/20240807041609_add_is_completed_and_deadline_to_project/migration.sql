/*
  Warnings:

  - You are about to drop the column `deadline_date` on the `Task` table. All the data in the column will be lost.
  - Added the required column `project_deadline_date` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `task_deadline_date` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "project_deadline_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "deadline_date",
ADD COLUMN     "task_deadline_date" TIMESTAMP(3) NOT NULL;
