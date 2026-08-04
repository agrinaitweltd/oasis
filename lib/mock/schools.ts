import type { School } from "@/types/portal";

export const schools: School[] = [
  { id: "sch_taibah", name: "Taibah International School", district: "Kampala", logoInitials: "TI" },
  { id: "sch_greenhill", name: "Greenhill Academy", district: "Kampala", logoInitials: "GA" },
  { id: "sch_kps", name: "Kampala Parents School", district: "Kampala", logoInitials: "KP" },
  { id: "sch_gayaza", name: "Gayaza High School", district: "Wakiso", logoInitials: "GH" },
  { id: "sch_budo", name: "King's College Budo", district: "Wakiso", logoInitials: "KB" },
  { id: "sch_smack", name: "St Mary's College Kisubi", district: "Wakiso", logoInitials: "SM" },
  { id: "sch_gombe", name: "Gombe High School", district: "Butambala", logoInitials: "GO" },
  { id: "sch_hillprep", name: "Hill Preparatory School", district: "Kampala", logoInitials: "HP" },
  { id: "sch_isu", name: "International School Uganda", district: "Kampala", logoInitials: "IS" },
  { id: "sch_rainbow", name: "Rainbow International School", district: "Kampala", logoInitials: "RI" },
];

export function searchSchools(query: string): School[] {
  const q = query.trim().toLowerCase();
  if (!q) return schools;
  return schools.filter((s) => s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q));
}

export function getSchoolById(id: string): School | undefined {
  return schools.find((s) => s.id === id);
}
