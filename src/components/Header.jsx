import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  MenuItem,
  Select
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Context/ThemeContext";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const { t, i18n } = useTranslation();

  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "background.paper", color: "text.primary" }}
    >
      <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between"  , px:{xs : 1 , sm: 2}}}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <img
            src="/images/prayer-logo.png"
            alt="Prayer Timings Logo"
            style={{ width: "40px", height: "40px" }}
          />
          {t("appName")}
        </Typography>

        {/* Language Switchers */}
        <Stack direction="row" spacing={1} alignItems="center" >
          {/*  Dropdown */}
          <Select
            size="small"
            value={i18n.language}
            onChange={handleLanguageChange}
            sx={{
              color: theme.palette.text.primary,

              ".MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary,
              },
              ".MuiSvgIcon-root": {
                color: theme.palette.text.primary,
              },
            }}
          >
            <MenuItem value="ar"> عربي</MenuItem>
            <MenuItem value="en"> English</MenuItem>
          </Select>

          <IconButton
            onClick={toggleTheme}
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {themeMode === "dark" ? (
                <motion.div
                  key="light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <LightMode sx={{ color: "#FFD700 !important" }} />
                </motion.div>
              ) : (
                <motion.div
                  key="dark"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <DarkMode sx={{ color: "#333 !important" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
