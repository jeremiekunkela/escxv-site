import { Mail } from "lucide-react";
import type { CSSProperties } from "react";
import type { BureauMember, Governance } from "@/features/club/types/governance";
import styles from "./ClubGovernance.module.css";

type ClubGovernanceProps = {
  governance: Governance;
};

type BureauRoleGroup = {
  role: string;
  members: BureauMember[];
};

/** Regroupe les membres partageant un même rôle (ex. présidents d'honneur) sur une seule carte. */
function groupBureauByRole(bureau: BureauMember[]): BureauRoleGroup[] {
  return bureau.reduce<BureauRoleGroup[]>((groups, member) => {
    const existing = groups.find((group) => group.role === member.role);

    return existing
      ? groups.map((group) =>
          group === existing
            ? { ...group, members: [...group.members, member] }
            : group,
        )
      : [...groups, { role: member.role, members: [member] }];
  }, []);
}

const isHonoraryRole = (role: string) => role.toLowerCase().includes("honneur");

export function ClubGovernance({ governance }: ClubGovernanceProps) {
  const bureauGroups = groupBureauByRole(governance.bureau);
  const presidentGroup = bureauGroups.find((group) => group.role === "Président");
  const otherGroups = bureauGroups.filter((group) => group.role !== "Président");
  // Bureau opérationnel d'abord, présidents d'honneur regroupés à la fin.
  const gridGroups = [
    ...otherGroups.filter((group) => !isHonoraryRole(group.role)),
    ...otherGroups.filter((group) => isHonoraryRole(group.role)),
  ];

  return (
    <div className={styles.block}>
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Le bureau</h3>
        <ul className={styles.bureauGrid}>
          {presidentGroup
            ? presidentGroup.members.map((member) => (
                <li
                  key={`${member.firstName}-${member.lastName}`}
                  className={`${styles.bureauCard} ${styles.bureauCardFeatured}`}
                  data-reveal="zoom"
                >
                  <p className={styles.role}>{presidentGroup.role}</p>
                  <p className={styles.featuredName}>
                    {member.firstName} {member.lastName}
                  </p>
                </li>
              ))
            : null}
          {gridGroups.map((group, index) => (
            <li
              key={group.role}
              className={styles.bureauCard}
              data-reveal="zoom"
              style={{ "--reveal-delay": `${Math.min(index, 6) * 60}ms` } as CSSProperties}
            >
              <p className={styles.role}>{group.role}</p>
              <div className={styles.names}>
                {group.members.map((member) => (
                  <p
                    key={`${member.firstName}-${member.lastName}`}
                    className={styles.name}
                  >
                    {member.firstName} {member.lastName}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Le comité directeur</h3>
        <ul className={styles.committeeList}>
          {governance.committee.map((section) => (
            <li key={section.section} className={styles.committeeRow} data-reveal>
              <div className={styles.rowHead}>
                <h4 className={styles.sectionName}>{section.section}</h4>
                <a href={`mailto:${section.email}`} className={styles.email}>
                  <Mail aria-hidden="true" size={16} />
                  {section.email}
                </a>
              </div>
              <p className={styles.members}>
                {section.members
                  .map((member) => `${member.firstName} ${member.lastName}`)
                  .join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
