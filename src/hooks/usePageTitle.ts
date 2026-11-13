import { useEffect } from "react";
import { useSchool } from "@/hooks/useSiteContent";

/** Sets the browser tab title, e.g. "Admissions | Brilliant Oriental Senior Secondary School". */
export const usePageTitle = (title?: string) => {
  const { name } = useSchool();
  useEffect(() => {
    document.title = title ? `${title} | ${name}` : `${name}, Fatehpur | CBSE Affiliated`;
  }, [title, name]);
};
