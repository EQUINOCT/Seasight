import React, {useState} from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface WidgetSelectorProps {
  onWidgetToggle: (widget: "alerts" | "layers" | "legend", isVisible: boolean) => void;
  visibleWidgets: {alerts:boolean, layers:boolean, legend:boolean};
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ onWidgetToggle, visibleWidgets }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
      <div className="flex justify-center w-[100px] bg-teal-100 bg-opacity-80 rounded-full">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ 
            border: '0.5px solid rgba(97, 179, 255, 0.5)',
            backgroundColor: 'rgb(0,0,0)',
            height: '35px',
            color: '#61B3FF',
            borderRadius: '20px',
            paddingX: '20px',
            justifyContent: 'center',
          }}
        >
          <span 
           style={{ textTransform: 'capitalize' }}
           className="text-white basis-auto font-inter">
            Widgets
          </span>
        </Button>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        slotProps={{
          paper: {
            sx : {
              backgroundColor: '#18181b',
              color: '#fff',
            },
          },
        }}
      >
        <MenuItem onClick={() => onWidgetToggle("alerts", !visibleWidgets.alerts)}>
          {visibleWidgets.alerts ? "Hide Alerts" : "Show Alerts"}
        </MenuItem>
        <MenuItem onClick={() => onWidgetToggle("layers", !visibleWidgets.layers)}>
          {visibleWidgets.layers ? "Hide Map Layers" : "Show Map Layers"}
        </MenuItem>
        <MenuItem onClick={() => onWidgetToggle("legend", !visibleWidgets.legend)}>
          {visibleWidgets.legend ? "Hide Legend" : "Show Legend"}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default WidgetSelector;
