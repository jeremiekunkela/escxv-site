export type BureauMember = {
  role: string;
  firstName: string;
  lastName: string;
};

export type CommitteeMember = {
  firstName: string;
  lastName: string;
};

export type CommitteeSection = {
  section: string;
  email: string;
  members: CommitteeMember[];
};

export type Governance = {
  bureau: BureauMember[];
  committee: CommitteeSection[];
};
