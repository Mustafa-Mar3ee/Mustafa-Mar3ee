import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useId, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { TodoSchema } from "../../schemas";
import { useFormik } from "formik";
import { useStore } from "../../zustand/store";
import { v4 as uuidv4 } from "uuid";

const MainModal: FC<any> = ({ setClose, open, mode, todoId }) => {
  const todos = useStore((state: any) => state.todos);
  let currentTask = mode !== "CREATE" ? todos?.find((el) => el._id === todoId) : {};
  const addTodo = useStore((state: any) => state.addTodo);
  const updateTodo = useStore((state: any) => state.updateTodo);
  const deleteTodo = useStore((state: any) => state.deleteTodo);
  const formik = useFormik({
    initialValues: {
      id: "",
      title: "",
      describtion: "",
      isComplete: false,
    },
    enableReinitialize: true ,
    onSubmit: async (values: any, { setErrors, resetForm }) => {
      if (mode === "UPDATE") {
        updateTodo(todoId, values);
      } else {
        // values["id"] = await uuidv4();
        values["isComplete"] = false;
        addTodo(values);
        resetForm();
      }
      setClose(true);
    },
    validationSchema: TodoSchema,
  });

  useEffect(() => {
    if (open) {
      if ( mode === "UPDATE") {
        formik.setValues({
          id: currentTask?.id || "",
          title: currentTask?.title || "",
          describtion: currentTask?.describtion || "",
          isComplete: currentTask?.isComplete || false,
        });
      }else if(mode==="CREATE"){
        formik.setValues({
          id:  "",
          title:  "",
          describtion:   "",
          isComplete:  false,
        });

      }
      console.log(mode)
    }
  }, [open]);
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
  };
  if (mode === "CREATE" || mode==="UPDATE")
    return (
      <Modal
  open={open}
  onClose={setClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}   component={"form"}   onSubmit={formik.handleSubmit}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography
          id="modal-modal-title"
          align="center"
          color={"#2ac870"}
          variant="h6"
          component="h2"
        >
          {mode === "CREATE" ? "NEW TASK" : "UPDATE TASK"}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          size="small"
          label="Title"
          fullWidth={true}
          variant="outlined"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={
            formik.touched.title && (formik.errors.title as any)
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          size="small"
          label="Description"
          multiline
          fullWidth={true}
          rows={4}
          id="describtion"
          name="describtion"
          placeholder="Write a describtion"
          value={formik.values.describtion}
          onChange={formik.handleChange}
          error={
            formik.touched.describtion &&
            Boolean(formik.errors.describtion)
          }
          helperText={
            formik.touched.describtion &&
            (formik.errors.describtion as any)
          }
        />
      </Grid>
      <Grid item xs={12} textAlign={"end"}>
        <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ minWidth: "30%" }}
            onClick={()=>setClose(true)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#2ac870", minWidth: "30%",
            "&:hover": {
              backgroundColor: "#42d684",
              color: "#fff"
          }
          }}
          >
            {mode === "CREATE" ? "Add" : "Update"}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  </Box>
</Modal>
    );

  else if (mode === "READ")
    return (
      <Modal
        open={open}
        onClose={setClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
              <Typography gutterBottom variant="h6" component="div">
              {currentTask.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {currentTask.describtion}

              </Typography>
        </Box>
      </Modal>
    );
  else if (mode === "DELETE")
    return (
      <Modal
        open={open}
        onClose={setClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                This action will delete the item. Are you sure?
              </Typography>
            </CardContent>
          </CardActionArea>
          <Stack direction="row" spacing={2}>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() =>{ 
              deleteTodo(todoId)
              setClose(true)
            }
              }
            >
              Delete
            </Button>
            <Button size="small" variant="contained" onClick={()=>setClose(true)} startIcon={<CancelIcon />}>
              Cancle
            </Button>
          </Stack>
        </Box>
      </Modal>
    );
  else return <></>;
};

export default MainModal;
