export interface AvatarDefinition {
  id: string;
  name: string;
  path: string;
  role: string;
}

export const AVATARS: AvatarDefinition[] = [
  { id: "avatar-01", name: "Coder", path: "/avatars/avatar-01-coder-headphones.png", role: "Coding Agent" },
  { id: "avatar-02", name: "Pilot", path: "/avatars/avatar-02-pilot-goggles.png", role: "Automation Agent" },
  { id: "avatar-03", name: "Wizard", path: "/avatars/avatar-03-wizard.png", role: "AI Strategist" },
  { id: "avatar-04", name: "Builder", path: "/avatars/avatar-04-construction.png", role: "DevOps Agent" },
  { id: "avatar-05", name: "Dark Coder", path: "/avatars/avatar-05-dark-coder.png", role: "Security Agent" },
  { id: "avatar-06", name: "Scientist", path: "/avatars/avatar-06-scientist.png", role: "Research Agent" },
  { id: "avatar-07", name: "Astronaut", path: "/avatars/avatar-07-astronaut.png", role: "Explorer Agent" },
  { id: "avatar-08", name: "Ninja", path: "/avatars/avatar-08-ninja.png", role: "Stealth Agent" },
  { id: "avatar-09", name: "Cool Cat", path: "/avatars/avatar-09-sunglasses.png", role: "Social Agent" },
  { id: "avatar-10", name: "Chef", path: "/avatars/avatar-10-chef.png", role: "Content Agent" },
  { id: "avatar-11", name: "Nurse", path: "/avatars/avatar-11-nurse.png", role: "Support Agent" },
  { id: "avatar-12", name: "Gamer", path: "/avatars/avatar-12-gamer.png", role: "Gaming Agent" },
  { id: "avatar-13", name: "Artist", path: "/avatars/avatar-13-artist.png", role: "Creative Agent" },
  { id: "avatar-14", name: "Professor", path: "/avatars/avatar-14-professor.png", role: "Teaching Agent" },
  { id: "avatar-15", name: "Explorer", path: "/avatars/avatar-15-explorer.png", role: "Discovery Agent" },
  { id: "avatar-16", name: "Detective", path: "/avatars/avatar-16-detective.png", role: "Analysis Agent" },
  { id: "avatar-17", name: "DJ", path: "/avatars/avatar-17-dj.png", role: "Media Agent" },
  { id: "avatar-18", name: "Photographer", path: "/avatars/avatar-18-photographer.png", role: "Visual Agent" },
  { id: "avatar-19", name: "Trader", path: "/avatars/avatar-19-trader.png", role: "Finance Agent" },
  { id: "avatar-20", name: "Robot AI", path: "/avatars/avatar-20-robot-ai.png", role: "AI Agent" },
  { id: "avatar-21", name: "Angel", path: "/avatars/avatar-21-angel.png", role: "Assistant Agent" },
  { id: "avatar-22", name: "Devil", path: "/avatars/avatar-22-devil.png", role: "Chaos Agent" },
  { id: "avatar-23", name: "Pirate", path: "/avatars/avatar-23-pirate.png", role: "Data Agent" },
  { id: "avatar-24", name: "Knight", path: "/avatars/avatar-24-knight.png", role: "Defense Agent" },
  { id: "avatar-25", name: "Suit", path: "/avatars/avatar-25-businessman.png", role: "Business Agent" },
  { id: "avatar-26", name: "Hacker", path: "/avatars/avatar-26-coder-hoodie.png", role: "Dev Agent" },
  { id: "avatar-27", name: "King", path: "/avatars/avatar-27-king.png", role: "Manager Agent" },
  { id: "avatar-28", name: "Camper", path: "/avatars/avatar-28-camper.png", role: "Outdoors Agent" },
  { id: "avatar-29", name: "Snow Cat", path: "/avatars/avatar-29-snow-cat.png", role: "Winter Agent" },
  { id: "avatar-30", name: "Zen", path: "/avatars/avatar-30-zen.png", role: "Mindful Agent" },
];

export const DEFAULT_AVATAR = AVATARS[0];

export function getAvatarById(id: string): AvatarDefinition {
  return AVATARS.find((a) => a.id === id) || DEFAULT_AVATAR;
}

export function getAvatarByPath(path: string): AvatarDefinition | undefined {
  return AVATARS.find((a) => a.path === path);
}
