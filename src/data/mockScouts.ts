import { Scout } from '@/types/scout';

export const mockScouts: Scout[] = [
  {
    id: "1",
    name: "James Clark",
    role: "Head Scout",
    email: "james.clark@brighton.com",
    phone: "+44 7123 456789",
    activePlayers: 5,
    lastReportDate: "2024-07-20",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
  },
  {
    id: "2",
    name: "Mia Scout",
    role: "European Scout",
    email: "mia.scout@brighton.com",
    phone: "+44 7987 654321",
    activePlayers: 8,
    lastReportDate: "2024-07-22",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
  },
  {
    id: "3",
    name: "David Lee",
    role: "Youth Scout",
    email: "david.lee@brighton.com",
    phone: "+44 7555 123456",
    activePlayers: 3,
    lastReportDate: "2024-07-18",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
  },
];