export interface Scout {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  activePlayers: number;
  lastReportDate: string;
  avatarUrl?: string;
}