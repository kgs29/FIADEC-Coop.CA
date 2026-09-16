import { FieldConfig } from "@/components/SearchFilterComponent";

import i18n from "@/locale/i18n";
import { UserInterface } from "@/types/auth.types";

export interface Base {
  name: string;
}

export const fieldConfig: Partial<
  Record<keyof Partial<UserInterface>, FieldConfig<Partial<UserInterface>>>
> = {
  username: {
    type: "string",
    label: i18n.t("username"),
  },
  last_name: {
    type: "string",
    label: i18n.t("last_name"),
  },
  first_name: {
    type: "string",
    label: i18n.t("first_name"),
  },
  email: {
    type: "string",
    label: i18n.t("email"),
  },
  phone_number: {
    type: "string",
    label: i18n.t("phone_number"),
  },
};

export const emptyModel: Partial<UserInterface> = {
  username: "",
  last_name: "",
  email: "",
  phone_number: "",
  first_name: "",
};
