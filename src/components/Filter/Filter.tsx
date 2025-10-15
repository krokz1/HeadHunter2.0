import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TextInput, ActionIcon, Text, Select, Pill } from "@mantine/core";
import { useAppDispatch } from "../../hooks/redux";
import {
  setSearchParams as setReduxSearchParams,
  fetchVacancies,
} from "../../store/slices/vacanciesSlice";
import { IconPlus, IconMapPin } from "@tabler/icons-react";
import styles from "./Filter.module.scss";

export function SkillsInput() {
  const dispatch = useAppDispatch();
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Redux",
  ]);
  const [selectedCity, setSelectedCity] = useState<string | null>("");
  const [searchParams, setUrlSearchParams] = useSearchParams();

  const cities = [
    { value: "", label: "Все города" },
    { value: "1", label: "Москва" },
    { value: "2", label: "Санкт-Петербург" },
  ];

  useEffect(() => {
    const areaParam = searchParams.get("area");
    const skillsParams = searchParams.getAll("skill_set");

    if (areaParam) setSelectedCity(areaParam);
    if (skillsParams.length > 0) setSkills(skillsParams);
  }, [searchParams]);

  const updateURLParams = (newSkills: string[], city: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete("skill_set");
    newSkills.forEach((skill) => newParams.append("skill_set", skill));

    if (city) {
      newParams.set("area", city);
    } else {
      newParams.delete("area");
    }

    setUrlSearchParams(newParams);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");

      updateURLParams(updatedSkills, selectedCity);

      dispatch(setReduxSearchParams({ skill_set: updatedSkills }));
      dispatch(
        fetchVacancies({
          skill_set: updatedSkills,
          industry: "7",
          professional_role: "96",
          per_page: 10,
        })
      );
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);

    updateURLParams(updatedSkills, selectedCity);

    dispatch(setReduxSearchParams({ skill_set: updatedSkills }));
    dispatch(
      fetchVacancies({
        skill_set: updatedSkills,
        industry: "7",
        professional_role: "96",
        per_page: 10,
      })
    );
  };

  const handleCityChange = (value: string | null) => {
    setSelectedCity(value);

    updateURLParams(skills, value);

    const areaValue = value || "";
    dispatch(setReduxSearchParams({ area: areaValue }));
    dispatch(
      fetchVacancies({
        area: areaValue,
        industry: "7",
        professional_role: "96",
        per_page: 10,
      })
    );
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      addSkill();
    }
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.asideСontainer}>
        <Text size="sm" fw={500} mb="xs" className={styles.asideLabel}>
          Ключевые навыки
        </Text>

        <div className={styles.inputGroup}>
          <TextInput
            placeholder="Навык"
            value={newSkill}
            onChange={(event) => setNewSkill(event.currentTarget.value)}
            onKeyPress={handleKeyPress}
            classNames={{ input: styles.inputSkill }}
          />
          <ActionIcon
            variant="filled"
            color="blue"
            className={styles.addButton}
            onClick={addSkill}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </div>

        <div className={styles.skillsList}>
          {skills.map((skill) => (
            <Pill
              key={skill}
              withRemoveButton
              onRemove={() => removeSkill(skill)}
              className={styles.skillChip}
            >
              {skill}
            </Pill>
          ))}
        </div>
      </div>

      <div className={styles.asideСontainer}>
        <div className={styles.cityContainer}>
          <Select
            data={cities}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Все города"
            leftSection={<IconMapPin size={16} color="#0F0F104D" />}
            classNames={{
              input: styles.inputCity,
              root: styles.root,
              section: styles.selectSection,
            }}
            styles={{
              dropdown: { zIndex: 9999 },
            }}
          />
        </div>
      </div>
    </aside>
  );
}
