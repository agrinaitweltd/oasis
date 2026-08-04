import type { HostelRoom, LibraryBook, LibraryLoan, TransportRoute } from "@/types/portal";
import { makeRng } from "./rand";
import { students } from "./students";
import { teachers } from "./teachers";

const rng = makeRng(8008);

export const libraryBooks: LibraryBook[] = [
  { title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature" },
  { title: "So Long a Letter", author: "Mariama Bâ", category: "Literature" },
  { title: "A Grain of Wheat", author: "Ngũgĩ wa Thiong'o", category: "Literature" },
  { title: "Uganda: A Modern History", author: "Phares Mutibwa", category: "History" },
  { title: "Basic Mathematics for Secondary Schools", author: "MoES", category: "Mathematics" },
  { title: "Introduction to Physics", author: "MoES", category: "Science" },
  { title: "Longman Active Science", author: "Longman", category: "Science" },
  { title: "Oxford English Grammar", author: "Oxford Press", category: "English" },
  { title: "The River Between", author: "Ngũgĩ wa Thiong'o", category: "Literature" },
  { title: "East African Geography", author: "MoES", category: "Geography" },
].map((b, i) => {
  const copiesTotal = rng.int(4, 20);
  return {
    id: `bk_${i}`,
    ...b,
    isbn: `978-9-${rng.int(1000, 9999)}-${rng.int(100, 999)}-${rng.int(0, 9)}`,
    copiesTotal,
    copiesAvailable: rng.int(0, copiesTotal),
  };
}) as LibraryBook[];

export const libraryLoans: LibraryLoan[] = Array.from({ length: 24 }, (_, i) => {
  const borrowedAt = rng.dateWithinDays(30);
  const returned = rng.bool(0.6);
  return {
    id: `loan_${i}`,
    bookId: rng.pick(libraryBooks).id,
    studentId: rng.pick(students).id,
    borrowedAt,
    dueAt: borrowedAt,
    returnedAt: returned ? rng.dateWithinDays(10) : null,
  };
});

const ROUTE_NAMES = ["Ntinda - Kyambogo", "Bukoto - Naalya", "Kansanga - Muyenga", "Kireka - Bweyogerere", "Najjera - Kiwatule", "Mengo - Rubaga"];
export const transportRoutes: TransportRoute[] = ROUTE_NAMES.map((name, i) => ({
  id: `rt_${i}`,
  name,
  driver: `${rng.pick(["Mr.", "Mr.", "Mr."])} ${rng.pick(["Ssali", "Byaruhanga", "Okello", "Muwonge", "Kiggundu"])}`,
  vehiclePlate: `UB${rng.int(100, 999)}${String.fromCharCode(65 + rng.int(0, 25))}`,
  capacity: rng.int(28, 45),
  studentsAssigned: rng.int(18, 40),
  stops: rng.pickMany(["Main Junction", "Market Stage", "Church Road", "Estate Gate", "Roundabout", "Clinic Stop", "Trading Centre"], rng.int(3, 5)),
}));

const BLOCKS = ["Acacia House", "Baobab House", "Cedar House", "Date Palm House"];
export const hostelRooms: HostelRoom[] = BLOCKS.flatMap((block, bi) =>
  Array.from({ length: 6 }, (_, ri) => {
    const capacity = rng.int(4, 8);
    return {
      id: `hr_${bi}_${ri}`,
      block,
      roomNo: `${block.slice(0, 1)}${100 + ri}`,
      capacity,
      occupied: rng.int(0, capacity),
      wardenName: `${teachers[(bi * 6 + ri) % teachers.length].firstName} ${teachers[(bi * 6 + ri) % teachers.length].lastName}`,
    };
  })
);
