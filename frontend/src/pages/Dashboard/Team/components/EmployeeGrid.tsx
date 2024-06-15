import { Box } from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import { AxiosError } from "axios";
import EditSelectGrid from "./EditSelectGrid";
import AddEmployeeDialog from "./AddEmployeeDialog";
import RemoveEmployeeDialog from "./RemoveEmployeeDialog";
import useEmployeeContext from "../hooks/useEmployeeContext";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { employeeActions } from "../data/employeeConstants";
import { getRoleString } from "../../../../utils/roleUtils";
import useToast from "../../../../hooks/useToast";
import getErrorData from "../../../../utils/getErrorData";
import { IUser } from "../../../../types/Post";
import { roleMap } from "../../../../utils/roleUtils";
import UserAvatar from "../../../../components/img/UserAvatar";

export default function EmployeeGrid() {
  const { state, dispatch } = useEmployeeContext();
  const { showToast } = useToast();
  const axiosPrivate = useAxiosPrivate();

  // Represents selected user
  const [selectedRowID, setSelectedRowID] = useState<string | undefined>(
    undefined
  );

  // Represents the name of the dialog that will be active
  const [activeDialog, setActiveDialog] = useState("");

  const handleOpenDialog = (dialogName: string) => setActiveDialog(dialogName);
  const handleCloseDialog = () => setActiveDialog("");

  // Effect loads employees into the employee state for the data-grid.
  useEffect(() => {
    const abortController = new AbortController();
    const getEmployees = async () => {
      try {
        const response = await axiosPrivate("/employees", {
          signal: abortController.signal,
        });
        // Set the employees state
        dispatch({
          type: employeeActions.SET_EMPLOYEES,
          payload: response.data,
        });
      } catch (err) {
        // If the request wasn't aborted, then a real error happened with the request
        if (!abortController.signal.aborted) {
          console.log("Failed to fetch employees: ", err);
        }
      }
    };

    getEmployees();

    return () => {
      abortController.abort();
    };
  }, [axiosPrivate, dispatch]);

  // Handles updating a row in our employee grid
  const processRowUpdate = useCallback(
    async (newRow: IUser): Promise<IUser> => {
      console.log("New Row: ", newRow);

      const response = await axiosPrivate.patch(
        `/employees/${newRow._id}`,
        newRow
      );

      // Show success message on toast
      showToast({
        message: "User update successful",
        severity: "success",
      });

      /*
			- Remember to update the global state. This allows things such as
			the 'RemoveEmployeeDialog' to keep in sync.
			*/
      dispatch({
        type: employeeActions.UPDATE_EMPLOYEE,
        payload: response.data,
      });

      /*
			- Return response, or the item that would meet the column criteria.
			This is the thing that's directly responsible for the update in the
			data grid.
			*/
      return response.data;
    },
    [axiosPrivate, dispatch, showToast]
  );

  // Handles catching/showing potential errors for processRowUpdate
  const handleRowUpdateError = useCallback(
    (err: unknown) => {
      const errMessage = getErrorData(err as AxiosError);
      showToast({ message: errMessage, severity: "error" });
    },
    [showToast]
  );

  /*
	- Initialize a user that we want to delete. If 'activeDialog' is 'removeEmployee' that means 
	our selectedRowID is the id of the user that we want to delete. Set that userToDelete value, 
	which will cause our RemoveEmployeeDialog to render.

	NOTE: So if activeDialog is 'removeEmployee' then only the RemoveEmployeeDialog will be rendered whilst 
	the other dialog isn't. And the vice versa is true.
	*/
  let userToDelete: IUser | undefined = undefined;
  if (activeDialog === "removeEmployee") {
    userToDelete = state.employees.find((e) => e._id === selectedRowID);
  }

  return (
    <Box>
      <EditSelectGrid
        selectedRowID={selectedRowID}
        setSelectedRowID={setSelectedRowID}
        rows={state.employees}
        // Mui uses field 'id' by default. To get it to work when our id field is not '.id'
        // we use getRowId to indicate how to get ID on a row.
        getRowId={(row) => row._id}
        processRowUpdate={processRowUpdate}
        handleRowUpdateError={handleRowUpdateError}
        columns={columns}
        handleAddItem={() => handleOpenDialog("addEmployee")}
        handleRemoveItem={() => handleOpenDialog("removeEmployee")}
        pageSizeOptions={[5, 10, 15]}
        initialPageSize={5}
      />

      <AddEmployeeDialog
        open={activeDialog === "addEmployee"}
        handleClose={handleCloseDialog}
      />

      {/* If userToDelete is defined, we are deleting a user so render the RemoveEmployeeDialog */}
      {userToDelete && (
        <RemoveEmployeeDialog
          open={true}
          handleClose={handleCloseDialog}
          targetUser={userToDelete}
        />
      )}
    </Box>
  );
}

const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 100,
    renderCell: ({ row }: { row: IUser }) => (
      <UserAvatar fullName={row.fullName} src={row.avatarSrc} />
    ),
  },
  { field: "username", headerName: "Username", width: 125, editable: true },
  { field: "email", headerName: "Email", width: 180, editable: false },
  { field: "fullName", headerName: "Name", width: 180, editable: true },
  {
    field: "role",
    headerName: "Role",
    width: 100,
    editable: true,
    type: "singleSelect", // by the way this is how we do a select drop down. as a field.

    /*
      These are the options in the select. So we'll visually render a 'Admin' option. If you click it 
      then processRowUpdate is passed in newRow, where newRow.role = roleMap.admin
    */
    valueOptions: [
      {
        value: parseInt(roleMap.admin),
        label: "Admin",
      },
      {
        value: parseInt(roleMap.editor),
        label: "Editor",
      },
    ],

    // Receives the role number field of a given row, and renders it as a role string
    valueFormatter: (role: number) => {
      const roleString = getRoleString(role);
      return roleString;
    },
  },
  /*
  - 'lastLogin' should be a date string in ISO 8601 format in UTC time. 
    Then we have to convert this into a JS date object for MUI. Then
    JS Date object handles the time zone conversion when we create 
    a date object from a UTC ISO 8601 string. As a result, the lastLogin
    will show the time relative to the user's timezones.
  */
  {
    field: "lastLogin",
    headerName: "Last Login",
    type: "dateTime",
    width: 180,
    valueFormatter: (lastLogin: Date | null) => {
      if (!lastLogin) {
        return "User hasn't logged in yet!";
      }
      return new Date(lastLogin);
    },
  },
];
