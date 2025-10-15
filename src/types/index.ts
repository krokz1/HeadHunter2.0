export interface IVacancy {
  id: string;
  name: string;
  salary?: {
    from: number;
    to: number;
    currency: string;
  };
  experience: {
    name: string;
  };
  employment: {
    name: string;
  };
  employer: {
    name: string;
  };
  area: {
    name: string;
  };
  alternate_url: string;
  description?: string;
  branded_description?: string;
  snippet?: {
    requirement?: string;
    responsibility?: string;
  };
  schedule?: {
    name: string;
  };
}

export interface VacanciesSearchParams {
  text?: string;
  area?: string;
  skill_set?: string[];
  page?: number;
  per_page?: number;
  industry?: string;
  professional_role?: string;
}