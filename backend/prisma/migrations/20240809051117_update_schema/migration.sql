/*
  Warnings:

  - You are about to drop the column `is_completed` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `project_completed_date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `task_completed_date` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "is_completed",
DROP COLUMN "project_completed_date",
ADD COLUMN     "project_updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "task_completed_date",
ADD COLUMN     "task_updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
