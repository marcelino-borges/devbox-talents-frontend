import { Box, Stack } from "@mui/material";
import React from "react";
import { TalentSummary } from "./interfaces";
import { Skill } from "../../models/talents";
import { PRIMARY_COLOR } from "../../constants/colors";

interface CardSearchTalentProps {
  talent: TalentSummary;
}

interface SkillsRowProps {
  label: string;
  skills?: Skill[];
}

const CardSearchTalent: React.FC<CardSearchTalentProps> = ({
  talent,
}: CardSearchTalentProps) => {
  const { firstName, lastName, email } = talent;

  const SkillsRow = ({ skills, label }: SkillsRowProps) => {
    if (!skills?.length) return null;

    return (
      skills?.length && (
        <Stack
          direction="row"
          gap="12px"
          fontSize="0.9em"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box fontWeight={600}>{label}:</Box>
          {skills.map((language: Skill) => (
            <Box
              key={language.value}
              p="2px 6px"
              bgcolor="rgba(0, 0, 0, 0.03)"
              borderRadius="5px"
              fontSize="0.8em"
              height="min-content"
            >
              {language.label}
            </Box>
          ))}
        </Stack>
      )
    );
  };

  return (
    <Stack
      direction="column"
      my="8px"
      fontSize="0.9em"
      border="1px solid rgba(0, 0, 0, 0.03)"
      p="16px"
      borderRadius="10px"
      gap="8px"
    >
      <Box
        fontWeight={600}
        color={PRIMARY_COLOR}
      >{`${firstName} ${lastName}`}</Box>
      <Box>{`${email}`}</Box>
      <Box height="16px" />
      <SkillsRow label="Linguagens" skills={talent.languages} />
      <SkillsRow label="Frameworks" skills={talent.frameworks} />
      <SkillsRow label="Bandos de dados" skills={talent.databases} />
      <SkillsRow label="Outras habilidades" skills={talent.otherSkills} />
    </Stack>
  );
};

export default CardSearchTalent;
