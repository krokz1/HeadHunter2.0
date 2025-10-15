import { Card, Group, Text, Button, Title, Badge } from "@mantine/core";
import type { IVacancy } from "../../../types";
import { Link } from "react-router-dom";
import styles from "./VacanciesCard.module.scss";

interface VacanciesCardProps {
  vacancy: IVacancy;
}

export function VacanciesCard({ vacancy }: VacanciesCardProps) {
  const formatSalary = () => {
    if (!vacancy.salary) return "Зарплата не указана";

    const { from, to, currency } = vacancy.salary;
    const currencySymbol = currency === "RUR" ? "₽" : currency;

    if (from && to) {
      return `${from.toLocaleString()} – ${to.toLocaleString()} ${currencySymbol}`;
    } else if (from) {
      return `от ${from.toLocaleString()} ${currencySymbol}`;
    } else if (to) {
      return `до ${to.toLocaleString()} ${currencySymbol}`;
    }
    return "Зарплата не указана";
  };

  const getWorkTypeInfo = () => {
    const schedule = vacancy.schedule?.name?.toLowerCase() || "";
    const isRemote = schedule.includes("удален");
    const isOffice = schedule.includes("полный");

    if (isRemote) {
      return {
        text: "Можно удалённо",
        className: styles.vacanciesCardTypeOfWorkRemote,
      };
    }

    if (isOffice) {
      return {
        text: "Офис",
        className: styles.vacanciesCardTypeOfWorkOffice,
      };
    }

    return {
      text: "Гибрид",
      className: styles.vacanciesCardTypeOfWorkHybrid,
    };
  };

  const workTypeInfo = getWorkTypeInfo();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={styles.vacanciesCard}
    >
      <Title order={2} className={styles.vacanciesCardTitle}>
        {vacancy.name}
      </Title>

      <Group className={styles.vacanciesCardContainer}>
        <Text className={styles.vacanciesCardSalary}>{formatSalary()}</Text>
        <Text className={styles.vacanciesCardExperience}>
          {vacancy.experience.name}
        </Text>
      </Group>

      <Text className={styles.vacanciesCardEmployer}>
        {vacancy.employer.name}
      </Text>

      <Badge
        className={`${styles.vacanciesCardTypeOfWork} ${workTypeInfo.className}`}
      >
        {workTypeInfo.text}
      </Badge>

      <Text className={styles.vacanciesCardCityOfWork}>
        {vacancy.area.name}
      </Text>

      <Group className={styles.vacanciesCardButtonContainer}>
        <Button
          className={styles.vacanciesCardButtonLook}
          component={Link}
          to={`/vacancies/${vacancy.id}`}
        >
          Смотреть вакансию
        </Button>
        <Button
          className={styles.vacanciesCardButtonReply}
          component="a"
          href={vacancy.alternate_url}
          target="_blank"
        >
          Откликнуться
        </Button>
      </Group>
    </Card>
  );
}
