import type { Field } from "payload/types";

import { CustomDateComponent } from "./component";

export const CustomDateField: Field = {
  name: "customDate",
  type: "date",
  label: "Date",
  required: true,
  admin: {
    components: {
      Field: CustomDateComponent,
    },
  },
};
