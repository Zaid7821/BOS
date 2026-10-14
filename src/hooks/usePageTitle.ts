import { useEffect } from "react";
import { SCHOOL } from "@/data/site";

/** Sets the browser tab title, e.g. "Admissions | Brilliant Oriental Senior Secondary School". */
export const usePageTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SCHOOL.name}` : `${SCHOOL.name}, Fatehpur | CBSE Affiliated`;
  }, [title]);
};
