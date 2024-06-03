import { roleMap } from "../../../../utils/roleUtils";

const roleSelectOptions = [
  {
    label: "Editor",
    value: roleMap.editor,
  },
  {
    label: "Admin",
    value: roleMap.admin,
  },
];

const employeeActions = {
  ADD_EMPLOYEE: "ADD_EMPLOYEE",
  DELETE_EMPLOYEE: "DELETE_EMPLOYEE",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  SET_EMPLOYEES: "SET_EMPLOYEES",
};

export { roleSelectOptions, employeeActions };
