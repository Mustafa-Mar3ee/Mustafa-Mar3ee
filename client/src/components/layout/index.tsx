import React, { useEffect, useState } from "react";
import { Grid, MenuItem, Button, Typography, Pagination } from "@mui/material";
import { Params, useStore } from "../../zustand/store";
import CheckIcon from "@mui/icons-material/Check";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SouthIcon from "@mui/icons-material/South";
import Divider from "@mui/material/Divider";
import NorthIcon from "@mui/icons-material/North";
import SortIcon from "@mui/icons-material/Sort";
import ClearIcon from "@mui/icons-material/Cancel";
import FilterIcon from "@mui/icons-material/FilterAlt";
import Skeleton from "@mui/material/Skeleton";

const Layout = ({ children }) => {
  const [params, setParams] = useState<Partial<Params>>({ page:1,limit: 5 });
  const [loader, setLoader] = useState(true);
  const handleMenuItemClick = (item: string, type: string = "sort") => {
    if (type === "sort") setParams({ sortBy: item,limit:5 });
    else if(type==="filter") setParams({ filter: item,limit:5 });
    else setParams({limit:5})

    handleClose();
  };
  const fetchTodos = useStore((state) => state.fetchTodos);
  const paginationInfo = useStore((state: any) => state.paginationInfo);
   
  useEffect(() => {
    setLoader(true);
    fetchTodos(params)
     
        setLoader(false);
    
     
      
  }, [JSON.stringify(params)]);
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorElFilter, setAnchorElFilter] =
    React.useState<null | HTMLElement>(null);
  const openFilter = Boolean(anchorElFilter);
  const handleClickFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilter(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setAnchorElFilter(null);
  };
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography variant="h5" color={"#2ac870"}>
          TASKS
        </Typography>
      </Grid>
      {loader ? (
        <Skeleton variant="rectangular" width={"100%"} height={"28rem"} />
      ) : (
        <>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="outlined"
                  disableElevation
                  onClick={handleClick}
                  color="success"
                  endIcon={<SortIcon />}
                >
                  Sort By
                </Button>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleMenuItemClick("createdAt");
                    }}
                    disableRipple
                  >
                    <NorthIcon />
                    Craeted At ASC
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("-createdAt");

                      handleClose();
                    }}
                    disableRipple
                  >
                    <SouthIcon />
                    Craeted At DESC
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("title");
                      handleClose();
                    }}
                    disableRipple
                  >
                    <NorthIcon />
                    Title ASC
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("-title");
                      handleClose();
                    }}
                    disableRipple
                  >
                    <SouthIcon />
                    Title DESC
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("");
                      handleClose();
                    }}
                  >
                    <ClearIcon />
                    Clear
                  </MenuItem>
                </StyledMenu>
              </Grid>
              <Grid item>
                <Button
                  id="demo-customized-button"
                  aria-controls={
                    openFilter ? "demo-customized-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={openFilter ? "true" : undefined}
                  variant="outlined"
                  disableElevation
                  onClick={handleClickFilter}
                  color="success"
                  endIcon={<FilterIcon />}
                >
                  Filter By
                </Button>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorElFilter}
                  open={openFilter}
                  onClose={handleCloseFilter}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("isComplete", "filter");
                      handleCloseFilter();
                    }}
                    disableRipple
                  >
                    <CheckIcon />
                    Completed Tasks
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuItemClick("-isComplete", "filter");
                      handleCloseFilter();
                    }}
                    disableRipple
                  >
                    <CloseIcon />
                    InCompleted Tasks
                  </MenuItem>
                  <MenuItem  
                   onClick={() => {
                    handleMenuItemClick("");
                    handleCloseFilter();
                  }}
                  >
                    <ClearIcon />
                    Clear
                  </MenuItem>
                </StyledMenu>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {children}
          </Grid>

          { <Pagination
             count={paginationInfo?.totalPages || 0}
             page={parseInt(paginationInfo?.page || '1')}
            onChange={(page, val) => {
              setParams({ page: val,limit:5 });
            }}
          />}
        </>
      )}
    </Grid>
  );
};

export default Layout;
