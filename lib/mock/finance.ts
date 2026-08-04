import type { ExpenseRecord, Invoice, Payment } from "@/types/portal";
import { makeRng } from "./rand";
import { students } from "./students";

const rng = makeRng(5005);

const TERM = "Term 2, 2026";
const TERM_FEE = 850000;

export const invoices: Invoice[] = students.map((s, i) => {
  const paidRoll = rng.next();
  const amountPaid = paidRoll < 0.45 ? TERM_FEE : paidRoll < 0.75 ? Math.round((TERM_FEE * rng.int(30, 90)) / 100) : 0;
  const status: Invoice["status"] =
    amountPaid >= TERM_FEE ? "Paid" : amountPaid > 0 ? "Partial" : rng.bool(0.5) ? "Overdue" : "Pending";
  return {
    id: `inv_${i}`,
    invoiceNo: `INV-${String(5000 + i)}`,
    studentId: s.id,
    term: TERM,
    amount: TERM_FEE,
    amountPaid,
    dueDate: "2026-08-15",
    status,
  };
});

export const payments: Payment[] = invoices
  .filter((inv) => inv.amountPaid > 0)
  .map((inv, i) => ({
    id: `pay_${i}`,
    invoiceId: inv.id,
    studentId: inv.studentId,
    amount: inv.amountPaid,
    method: rng.pick(["Mobile Money", "Bank Transfer", "Cash", "Card"] as const),
    reference: `TXN${rng.int(100000, 999999)}`,
    paidAt: rng.dateWithinDays(45),
  }));

export const expenses: ExpenseRecord[] = [
  { category: "Staff Salaries", description: "August staff payroll" },
  { category: "Utilities", description: "Electricity and water bills" },
  { category: "Maintenance", description: "Classroom block roof repairs" },
  { category: "Supplies", description: "Stationery and exercise books" },
  { category: "Transport", description: "Fuel for school buses" },
  { category: "Catering", description: "Termly food supplies" },
  { category: "Events", description: "Inter-house sports day" },
  { category: "Technology", description: "Computer lab equipment upgrade" },
].map((e, i) => ({
  id: `exp_${i}`,
  category: e.category,
  description: e.description,
  amount: rng.int(400, 9200) * 1000,
  date: rng.dateWithinDays(60),
  approvedBy: "Bursar",
}));

export function totalCollected() {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}
export function totalOutstanding() {
  return invoices.reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0);
}
export function totalExpenses() {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
