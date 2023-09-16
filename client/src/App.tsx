import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  useTheme,
  Chip,
  CssBaseline,
  Grid,
  IconButton,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import MainModal from "./components/modal";
import { useStore } from "./zustand/store";
import Layout from "./components/layout";

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [mode, setMode] = useState<
  "CREATE" | "READ" | "UPDATE" | "DELETE" | ""
  >("");
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [todoId, setTodoId] = useState(-1);
  const todos = useStore((state: any) => state.todos);
  const toggleTodo = useStore((state: any) => state.toggleTodo);
  const reorderTodos = useStore((state: any) => state.reorderTodos);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body1,
    padding: theme.spacing(1.5),
    boxShadow: "none",
    textAlign: "start",
    color: theme.palette.text.secondary,
  }));
  const mainStyle = {
    minHeight: '100vh',
    backgroundImage: "linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    reorderTodos(result.source.index, result.destination.index);
  };
  const reorder = (
    list: Iterable<unknown> | ArrayLike<unknown>,
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  return (
    <div style={mainStyle}>
      <MainModal
        setClose={handleClose}
        setOpen={handleOpen}
        open={open}
        mode={mode}
        todoId={todoId}
      />
      <CssBaseline />
      <Grid
        container
        sx={{ backgroundColor: "#eee",  borderRadius: "5px" }}
        p={4}
        xs={6}
        
      >
         <Layout>
        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable" key={"droppable"}   >
            {(provided, snapshot) => (
              <Grid
                item
                xs={12}
                sx={{ height: "80%" ,overflowY:"auto" ,minHeight:"28rem",maxHeight:"29rem"}}
                {...provided.droppableProps}
                ref={provided.innerRef}
  
              >
             
                <Grid container spacing={2} >
                  {todos.map((el, index) => (
                    <Draggable
                      key={el._id}
                      draggableId={`${el._id}`}
                      index={index}
                      
                    >
                      {(provided, snapshot) => (
                        <Grid
                          item
                          xs={12}
                          
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                         
                          >
                          <Item
                          key={el._id}
                            sx={{
                              borderRight: `solid 5px ${
                                el.isComplete === true ? "#42d684" : "red"
                              }`,
                            }}
                          >
                            <Grid
                              container
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <Grid item xs={9} sx={{ cursor: "pointer" }}>
                                <Grid
                                  container
                                  justifyContent={"space-between"}
                                  onClick={() => {
                                    setMode("READ");
                                    setTodoId(el._id);
                                    setOpen(true);
                                  }}
                                  
                                >
                                  <Grid item   md={6}>
                                    <Typography>{el.title}</Typography>
                                  </Grid>
                                  <Grid item sx={{display:isXSmall?"none":"block"}}>
                                  
                                  {el.isComplete === true ? (
                                    <Chip
                                    label="Completed"
                                    color="success"
                                    variant="outlined"
                                    />
                                    ) : (
                                      <Grid item>
                                      <Chip
                                        label="incomplete"
                                        color="error"
                                        variant="outlined"
                                        />
                                    </Grid>
                                  )}
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item
                              
                              sx={{display:"flex",flexDirection:isXSmall ?"column":"row"}}
                               
                               >
                                <IconButton
                                  aria-label="CheckIcon"
                                  onClick={() => {
                                    toggleTodo(el._id);
                                  }}
                                >
                                  {el.isComplete === false ? (
                                    <CheckIcon fontSize="small" />
                                  ) : (
                                    <CloseIcon fontSize="small" />
                                  )}
                                </IconButton>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => {
                                    setMode("UPDATE");
                                    setTodoId(el._id);
                                    setOpen(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    setMode("DELETE");
                                    setTodoId(el._id);
                                    setOpen(true);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>

                                <IconButton
                                  aria-label="delete"
                                  sx={{ cursor: "grab" }}
                                  {...provided.dragHandleProps}
                                >
                                  <DragIndicatorIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Item>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
            </Layout>
            
        
        <Grid item xs={12} alignSelf={"flex-end"} textAlign={"end"}>
          <IconButton
            aria-label="AddIcon"
            onClick={() => {
              setMode("CREATE");
              handleOpen();
            }}
            sx={{
              background: "#42d684",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#42d684",
                color: "#fff"
            }
            }}
          >
            <AddIcon fontSize="medium"  />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
