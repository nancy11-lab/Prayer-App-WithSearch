import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, CircularProgress, Paper, Popper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCountryCity } from "../Context/CountryCityContext";
import { CustomPopper } from "../Features/CustomPopper";

const getDefaultCity = (country) => {
  if (!country) return "cairo"; // مفيش دولة → القاهرة
  if (country.country === "Egypt") return "cairo"; // مصر → القاهرة
  if (country.cities?.length > 0) return country.cities[0]; // أي دولة تانية → أول مدينة
  return ""; // fallback
};

export default function CitiesByCountryInput() {
  const { t, i18n } = useTranslation();
  const {
    country,
    setCountry,
    selectedCity,
    setSelectedCity,
    countries,
    cities,
    loadingCities,
    loadingCountries,
  } = useCountryCity();

  const getCountryLabel = (countryName) => {
    const countryKey = countryName.toLowerCase();
    const translation = t(`countries.${countryKey}.name.${i18n.language}`, {
      defaultValue: "",
    });
    return translation !== "" ? translation : countryName;
  };

  const getCityLabel = (cityName) => {
    // const countryKey = country.toLowerCase();
    const cityKey = cityName.toLowerCase();
    const translation = t(
      `countries.${country?.country?.toLowerCase()}.cities.${cityKey}.${
        i18n.language
      }`,
      {
        defaultValue: "",
      }
    );
    return translation !== "" ? translation : cityName; // لو موجود تلرجم لو مش موجود رجع الاصلي
  };

  const handleCountryChange = (e, newCountry) => {
    setCountry(newCountry || null);
    if (!newCountry) {
      setSelectedCity(getDefaultCity(null));
      return;
    }
    setSelectedCity(getDefaultCity(newCountry));
  };

  const handleCityChange = (e, newCity) => {
   if(!newCity || newCity === ""){
    setSelectedCity(getDefaultCity(country));
   }else{
    setSelectedCity(newCity);
   }
  };

  // popper
  const commonProps = {
    disablePortal: true,
    PopperComponent: CustomPopper,
    sx: {
      "& .MuiInputLabel-root": { color: "text.primary" },
      "& .MuiInputLabel-root.Mui-focused": { color: "text.primary" },
      "& .MuiInputBase-input": { color: "text.primary" },
      "& .MuiAutocomplete-endAdornment svg": { color: "text.primary" },
      "& .MuiInputBase-input::placeholder": {
        color: "text.primary",
        opacity: 1,
      }, //  placeholder أبيض
    },
    slotProps: {
      paper: {
        sx: {
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
          marginTop: 2,
          color: "black",
        },
      },
      listbox: {
        sx: {
          maxHeight: 150,
          overflowY: "auto", // scroll واحد فقط
          "& .MuiAutocomplete-option": {
            "&.Mui-focused": { backgroundColor: "#213547" }, // hover فاتح
            "&.Mui-selected": { backgroundColor: "#ccc" }, // العنصر المختار
            color: "text.primary",
          },
        },
      },
    },
  };

  return (
    <>
      <Box sx={{ width: { xs: "90%", sm: "45%", md: "35%" } }}>
        <Autocomplete
          {...commonProps}
          getOptionLabel={(option) => getCountryLabel(option.country)}
          options={countries}
          value={country || null}
          onChange={handleCountryChange}
          loading={loadingCountries}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("labelCountry")}
              placeholder={t("chooseCountry")}
              inputRef={{
                ...params.inputProps,
                endAdornment: (
                  <>
                    {loadingCountries ? (
                      <CircularProgress color="inhert" size={20} />
                    ) : null}
                    {params.inputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
      {/* // cities */}
      <Box sx={{ width: { xs: "90%", sm: "45%", md: "35%" } }}>
        <Autocomplete
          {...commonProps}
          getOptionLabel={
            (option) => getCityLabel(option) // الترجمه او الاسم الاصلي
          }
          options={cities}
          value={selectedCity || null}
          onChange={handleCityChange}
          loading={loadingCities}
          disabled={!country}
          clearOnEscape // يمسح عند الضغط علي Esc
          isOptionEqualToValue={(option, value) => option === value}
          filterOptions={(options, { inputValue }) => {
            return options.filter((opt) =>
              getCityLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
            );
          }}
          renderInput={(params) => (
            <TextField
              id="text-city"
              disabled={!country}
              {...params}
              label={t("labelCity")}
              placeholder={t("chooseCity")}
              inputRef={{
                ...params.inputProps,
                endAdornment: (
                  <>
                    {loadingCountries ? (
                      <CircularProgress color="inhert" size={20} />
                    ) : null}
                    {params.inputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </>
  );
}
