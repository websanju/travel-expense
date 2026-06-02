-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_paidById_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "paidById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "TripMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
