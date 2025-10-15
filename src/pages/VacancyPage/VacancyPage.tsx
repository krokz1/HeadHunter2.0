import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  Card,
  Badge,
  Loader,
} from "@mantine/core";
import { Header } from "../../components/Header/Header";
import type { IVacancy } from "../../types/index";
import styles from "./VacancyPage.module.scss";

interface IEmployerDetail {
  id: string;
  name: string;
  description?: string;
  branded_description?: string;
}

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const [vacancy, setVacancy] = useState<IVacancy | null>(null);
  const [employer, setEmployer] = useState<IEmployerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancyData = async () => {
      try {
        setLoading(true);

        const vacancyResponse = await fetch(
          `https://api.hh.ru/vacancies/${id}`
        );

        if (!vacancyResponse.ok) {
          throw new Error("Вакансия не найдена");
        }

        const vacancyData = await vacancyResponse.json();
        setVacancy(vacancyData);

        if (vacancyData.employer?.id) {
          try {
            const employerResponse = await fetch(
              `https://api.hh.ru/employers/${vacancyData.employer.id}`
            );
            if (employerResponse.ok) {
              const employerData = await employerResponse.json();
              setEmployer(employerData);
            }
          } catch (employerErr) {
            console.warn(
              "Не удалось загрузить данные о компании:",
              employerErr
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVacancyData();
    }
  }, [id]);

  const formatSalary = (salary: IVacancy["salary"]) => {
    if (!salary) return "Зарплата не указана";

    const { from, to, currency } = salary;
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

  const createMarkup = (html: string) => {
    return { __html: html };
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container
          size="lg"
          py="xl"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Loader size="lg" />
        </Container>
      </>
    );
  }

  if (error || !vacancy) {
    return (
      <>
        <Header />
        <Container size="lg" py="xl">
          <Text c="red">{error || "Вакансия не найдена"}</Text>
          <Button component={Link} to="/vacancies" mt="md">
            Вернуться к списку вакансий
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Card className={styles.vacanciesCard}>
          <Title order={1} className={styles.vacanciesCardTitle}>
            {vacancy.name}
          </Title>

          <Group className={styles.vacanciesCardContainer}>
            <Text className={styles.vacanciesCardSalary}>
              {formatSalary(vacancy.salary)}
            </Text>
            <Text className={styles.vacanciesCardExperience}>
              {vacancy.experience.name}
            </Text>
          </Group>
          <Text className={styles.vacanciesCardEmployer}>
            {vacancy.employer.name}
          </Text>

          {vacancy.schedule && (
            <Badge className={styles.vacanciesCardTypeOfWork}>
              {vacancy.schedule.name}
            </Badge>
          )}

          <Text className={styles.vacanciesCardCityOfWork}>
            {vacancy.area.name}
          </Text>

          <Group className={styles.vacanciesCardButtonContainer}>
            <Button
              component="a"
              href={vacancy.alternate_url}
              target="_blank"
              className={styles.vacanciesCardButtonLook}
            >
              Откликнуться на hh.ru
            </Button>
          </Group>
        </Card>

        <Card className={styles.vacanciesCard}>
          <Title order={3} className={styles.vacanciesCardDescriptionTitle}>
            Компания
          </Title>

          {employer?.description ? (
            <Text
              className={styles.vacanciesCardDescriptionText}
              dangerouslySetInnerHTML={createMarkup(employer.description)}
            />
          ) : (
            <Text className={styles.vacanciesCardDescriptionText}>
              Информация о компании отсутствует в базе данных.
            </Text>
          )}

          <Title order={3} className={styles.vacanciesCardDescriptionTitle}>
            О проекте:
          </Title>

          {vacancy.branded_description ? (
            <Text
              className={styles.vacanciesCardDescriptionText}
              dangerouslySetInnerHTML={createMarkup(vacancy.branded_description)}
            />
          ) : vacancy.description ? (
            <Text
              className={styles.vacanciesCardDescriptionText}
              dangerouslySetInnerHTML={createMarkup(vacancy.description)}
            />
          ) : vacancy.snippet?.requirement ? (
            <Text
              className={styles.vacanciesCardDescriptionText}
              dangerouslySetInnerHTML={createMarkup(
                vacancy.snippet.requirement || ""
              )}
            />
          ) : vacancy.snippet?.responsibility ? (
            <Text
              className={styles.vacanciesCardDescriptionText}
              dangerouslySetInnerHTML={createMarkup(
                vacancy.snippet.responsibility || ""
              )}
            />
          ) : (
            <Text className={styles.vacanciesCardDescriptionText}>
              Подробное описание проекта отсутствует.
            </Text>
          )}
        </Card>
      </main>
    </>
  );
}
