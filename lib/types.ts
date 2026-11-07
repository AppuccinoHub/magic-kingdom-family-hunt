export type Member = {
  id: string;
  nickname: string;
  avatar: string;
  emoji: string;
  avatarLabel: string;
};

export type ChallengeProgress = {
  index: number;
  done: boolean;
  note: string;
  hasPhoto: boolean;
  stampedByName: string | null;
  stampedAt: string | null;
};

export type HuntState = {
  phoneOnly: boolean;
  rev: number;
  hunt: {
    id: string;
    code: string;
    familyName: string;
    advisorName: string;
    createdAt: string;
  };
  me: Member;
  members: Member[];
  challenges: ChallengeProgress[];
  bingoLineCount: number;
  stampCount: number;
};

export type PersonInput = {
  familyName?: string;
  nickname?: string;
  avatar?: string;
  advisorName?: string;
};
