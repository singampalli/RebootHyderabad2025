import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import GCPConfigManager from "../components/GCPConfigManager";

export const Header: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    window.location.reload();
  };

  const menuOptions = [
    { label: "Configure Project", onClick: handleDialogOpen },
  ];

  // Dialog component to be rendered inside Header
  const ProjectConfigDialog = (
    <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
      sx: {
        width: "60vw",
        maxWidth: "60vw",
      },
      }}
    >
      <DialogTitle>Configure Project</DialogTitle>
      <GCPConfigManager  onSuccess={handleDialogClose} />
      <DialogActions>
      <Button onClick={handleDialogClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {    
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          GCP Dashboard
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="settings"
          onClick={handleMenuOpen}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {menuOptions.map((option, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                option.onClick();
                handleMenuClose();
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
    {ProjectConfigDialog}
    
    </>
  );
};

export default Header;
