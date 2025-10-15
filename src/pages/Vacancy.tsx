import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  fetchVacancies,
  setSearchParams as setReduxSearchParams,
} from "../store/slices/vacanciesSlice";
import styles from "./Vacancy.module.scss";
import { Header } from "../components/Header/Header";
import { MainTop } from "../components/MainTop/MainTop";
import { ListOfVacancies } from "../components/ListOfVacancies/ListOfVacancies";
import { SkillsInput } from "../components/Filter/Filter";

export function VacancyPageLayout() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.vacancies);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const text = searchParams.get("text") || "";
    const area = searchParams.get("area") || "";
    const skill_set = searchParams.getAll("skill_set");

    const params = {
      industry: "7",
      professional_role: "96",
      per_page: 10,
      ...(text && { text }),
      ...(area && { area }),
      ...(skill_set.length > 0 && { skill_set }),
    };

    dispatch(setReduxSearchParams(params));
    dispatch(fetchVacancies(params));
  }, [dispatch, searchParams]);

  return (
    <AppShell className={styles.vacancyLayout}>
      <Header />
      <main className={styles.main}>
        <MainTop />
        <SkillsInput />
        <ListOfVacancies vacancies={items} loading={loading} error={error} />
      </main>
    </AppShell>
  );
}
