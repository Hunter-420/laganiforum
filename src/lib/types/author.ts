export interface AuthorProfile {
  id: string;
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  facebookUrl?: string;
  isDefault?: boolean;
}

export const DEFAULT_AUTHORS: AuthorProfile[] = [
  {
    id: "pitamber",
    name: "Pitamber Gautam",
    title: "Market Analyst",
    bio: "Pitamber covers NEPSE, forex, and personal finance with a focus on educational market analysis. Content is research-driven and intended to help readers understand setups and risk—not to provide individualized investment advice.",
    facebookUrl: "https://www.facebook.com/agbibas",
    isDefault: true,
  },
];
