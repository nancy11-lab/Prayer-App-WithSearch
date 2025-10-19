import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const savedTheme = localStorage.getItem("themeMode") || "dark";
  const [themeMode, setThemeMode] = useState(savedTheme);

  const { i18n } = useTranslation();

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newTheme);
    localStorage.setItem("themeMode", newTheme);
    console.log("theme change", newTheme);
  };

  //تحديد الاتجاه حسب اللغه
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const theme = createTheme({
    direction,
    typography: {
      fontFamily: ["IBM"],
    },
    palette: {
      mode: themeMode,
      ...(themeMode === "dark"
        ? {
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff", secondary: "#bbbbbb" },
          }
        : {
            background: { default: "#ffffff", paper: "#f5f5f5" },
            text: { primary: "#000000", secondary: "#555555" },
          }),
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: "12px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            transition: "all 0.3s ease", //  smooth transition
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              transition: "all 0.3s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "dark" ? "#ffffff" : "#000000",
            },
          }),
          input: ({ theme }) => ({
            color: theme.palette.text.primary,
            transition: "color 0.3s ease",
            "&::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
              transition: "color 0.3s ease",
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            transition: "color 0.3s ease",
            "&.Mui-focused": {
              color: theme.palette.text.primary,
            },
          }),
        },
      },
    },
  });

  //  body dynamic + transition
  //غيّر لون البودي مع كل تغيير ثيم
  useEffect(() => {
    document.body.style.transition = "all 0.3s ease";
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
    document.body.dir = direction; // 👈 غير اتجاه الصفحة
  }, [theme, direction]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
