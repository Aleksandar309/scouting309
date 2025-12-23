import { ForumPost, ForumCategory } from '@/types/forum';

export const FORUM_CATEGORIES: ForumCategory[] = [
  { id: "general-discussions", name: "Opšte diskusije", description: "Mesto za sve opšte teme i najave." },
  { id: "scouting-strategies", name: "Skauting strategije", description: "Razmenite mišljenja o skauting metodama i analizama igrača." },
  { id: "suggestions-feedback", name: "Predlozi i povratne informacije", description: "Podelite svoje ideje za poboljšanje platforme." },
];

export const initialMockForumPosts: ForumPost[] = [
  {
    id: "post1",
    categoryId: "general-discussions",
    authorId: "scout1",
    authorName: "James Clark",
    authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
    timestamp: "2024-07-28T10:30:00Z",
    content: "Zdravo svima! Dobrodošli na naš novi forum. Radujem se diskusijama i razmeni ideja sa svima vama. Slobodno se predstavite!",
    likes: 5,
    comments: [
      {
        id: "comment1",
        authorId: "scout2",
        authorName: "Mia Scout",
        authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
        timestamp: "2024-07-28T11:00:00Z",
        content: "Odlična inicijativa, James! Jedva čekam da vidim šta će se sve ovde dešavati.",
      },
      {
        id: "comment2",
        authorId: "scout3",
        authorName: "David Lee",
        authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
        timestamp: "2024-07-28T11:15:00Z",
        content: "Pozdrav svima! Nadam se da ćemo imati produktivne razgovore.",
      },
    ],
  },
  {
    id: "post2",
    categoryId: "scouting-strategies",
    authorId: "scout2",
    authorName: "Mia Scout",
    authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
    timestamp: "2024-07-27T15:00:00Z",
    content: "Koje su vaše omiljene metode za procenu potencijala mladih igrača? Da li se oslanjate više na sirove atribute ili na performanse u mlađim kategorijama?",
    likes: 12,
    comments: [
      {
        id: "comment3",
        authorId: "scout1",
        authorName: "James Clark",
        authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
        timestamp: "2024-07-27T15:45:00Z",
        content: "Ja uvek gledam kombinaciju. Sirovi potencijal je bitan, ali mentalni atributi i 'game intelligence' su ključni za adaptaciju na viši nivo.",
      },
    ],
  },
  {
    id: "post3",
    categoryId: "suggestions-feedback",
    authorId: "scout3",
    authorName: "David Lee",
    authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
    timestamp: "2024-07-26T09:00:00Z",
    content: "Predlažem da dodamo opciju za video analizu direktno u profil igrača. Bilo bi korisno imati sve na jednom mestu.",
    likes: 8,
    comments: [
      {
        id: "comment4",
        authorId: "scout1",
        authorName: "James Clark",
        authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=JC",
        timestamp: "2024-07-26T09:30:00Z",
        content: "Odlična ideja, David! Razmotrićemo to za buduće nadogradnje.",
      },
    ],
  },
  {
    id: "post4",
    categoryId: "general-discussions",
    authorId: "scout2",
    authorName: "Mia Scout",
    authorAvatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=MS",
    timestamp: "2024-07-25T18:00:00Z",
    content: "Da li neko ima iskustva sa skautingom u Južnoj Americi? Koje lige preporučujete za pronalaženje 'dragulja'?",
    likes: 7,
    comments: [],
  },
];