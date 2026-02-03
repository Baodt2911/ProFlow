/*
  Warnings:

  - You are about to drop the column `role_id` on the `project_members` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `project_members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('ADMIN', 'TEAM_LEAD', 'PM', 'MEMBER');

-- DropForeignKey
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_role_id_fkey";

-- AlterTable
ALTER TABLE "project_members" DROP COLUMN "role_id",
ADD COLUMN     "role" "ProjectRole" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "roles";
