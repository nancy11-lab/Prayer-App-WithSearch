import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

import Prayer from "./Prayer";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";
import CitiesByCountryInput from "./CitiesByCountryInput";
import { useTranslation } from "react-i18next";
import { useCountryCity } from "../Context/CountryCityContext";
// moment.locale("ar");

import {
  WbTwilight,
  WbSunny,
  Brightness5,
  NightsStay,
  Nightlight,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const prayersArray = [
  { key: "Fajr", displayName: "الفجر", icon: <WbTwilight /> },
  { key: "Dhuhr", displayName: "الظهر", icon: <WbSunny /> },
  { key: "Asr", displayName: "العصر", icon: <Brightness5 /> },
  { key: "Maghrib", displayName: "المغرب", icon: <NightsStay /> },
  { key: "Isha", displayName: "العشاء", icon: <Nightlight /> },
];

export default function MainContent() {
  const { t, i18n } = useTranslation();

  //State
  const [timings, setTimings] = useState({});
  const { country, selectedCity, loadingCities } = useCountryCity();

  const [today, setToday] = useState(moment());

  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");

  // get data from api
  //get prayer timrs by city
  const getTimings = async (countryName, cityName) => {
    try {
      console.log("from mainContent", countryName, cityName);
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=${countryName}&city=${cityName}`
      );
      if (response.data?.data?.timings) {
        console.log(response.data.data.timings);
        setTimings(response.data.data.timings);
      }
    } catch (error) {
      console.error("Error Fetching prayer Tiems", error);
    }
  };

  useEffect(() => {
    //لو لسه بنجيب المدن
    if (loadingCities) return;

    //في دوله محدده لكن المدينه لسع فاضيه
    if (country && (!selectedCity || selectedCity === "")) {
      return;
    }
    // مفيش دوله محدده
    if (!country) {
      getTimings("Egypt", "cairo");
      return;
    }

    getTimings(country.country, selectedCity);
    console.log("***********************");
  }, [country, selectedCity, loadingCities]);

  // update live clock and countdown
  useEffect(() => {
    let interval = setInterval(() => {
      setToday(moment());
      setupCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timings, i18n.language]);

  //change moment.locale depond on language
  useEffect(() => {
    const lang = i18n.language.startsWith("ar") ? "ar" : "en";
    moment.locale(lang);
    // console.log("moment", moment.locale());
    // console.log("lang : ", lang);
  }, [i18n.language]);

  const normalizedCountry = country?.country?.toLowerCase() || "egypt";
  const normalizedCity = selectedCity?.toLowerCase() || "cairo";

  const translatedCity = t(
    `countries.${normalizedCountry}.cities.${normalizedCity}.${i18n.language}`,
    {
      defaultValue:
        i18n.language === "ar"
          ? normalizedCity === "cairo"
            ? "القاهرة"
            : normalizedCity
          : normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1),
    }
  );

  //countdown Timer
  const setupCountdownTimer = () => {
    if (!timings || Object.keys(timings).length === 0) return;

    const momemtNow = moment();
    let nextPrayer;

    // const isha = timings["Isha"];
    // console.log(isha);
    // const ishaMoment = moment(isha , "hh:mm");
    // console.log(momemtNow.isBefore(ishaMoment));
    if (
      momemtNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momemtNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      // nextPrayer = "Dhuhr";
      nextPrayer = 1;
    } else if (
      momemtNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momemtNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      momemtNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momemtNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      momemtNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momemtNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }
    setNextPrayerIndex(nextPrayer);

    // now after kno=wimg the next prayer , we can setup countdown timer by getting prayers time
    const nextPrayerObject = prayersArray[nextPrayer];
    //prayersArray[0] => { key: "Fajr", displayName: "الفجر" },

    const nextPrayerTime = timings[nextPrayerObject.key]; //Fajr
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    // console.log(nextPrayerTime);// is string 12:48 pm

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momemtNow);
    // console.log(remainingTime);// mm seconds

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momemtNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDifferance = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDifferance;
    }

    const durationRemainingTime = moment.duration(remainingTime);
    if (i18n.language === "ar") {
      setRemainingTime(
        `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
      );
    } else {
      setRemainingTime(
        `${durationRemainingTime.hours()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.seconds()}`
      );
    }

    // console.log(durationRemainingTime.hours(), durationRemainingTime.minutes() , durationRemainingTime.seconds());
  };
  // console.log(prayersArray[0]);
  return (
    <>
      {/* Top Raw */}

      <Grid
        container
        spacing={2}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          mt: 3,
          p: 2,
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ textAlign:{ xs : "start" , md:"center"}}}>
            <Typography variant="h6" component="div">
              {today.format("MMMM Do YYYY |  h:mm a")}
            </Typography>
            <Typography variant="h4" component="div">
              {translatedCity}
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{textAlign:{ xs : "start" , md:"center"}}}>
            <Typography variant="h6" component="div">
              {t("title-prayer")}{" "}
              <Typography
                variant="body2"
                component="span"
                sx={{
                  fontSize: "1.4rem",
                  color: "rgb(3,161,110)",
                  fontWeight: "bold",
                }}
              >
                {i18n.language === "ar"
                  ? prayersArray[nextPrayerIndex].displayName
                  : prayersArray[nextPrayerIndex].key}
              </Typography>
            </Typography>
            <Typography variant="h6" component="div">
              {remainingTime}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* End Top Raw */}
      {/* Search cities-countries */}
      <Stack
        // container
        direction="row"
        sx={{ mt: 2, mb: 2 }}
      >
        <Stack
          width="100%"
          direction={{ xs: "column", sm: "row" }}
          sx={{
            p: 2,
          }}
          justifyContent={"center"}
          alignItems={"center"}
          gap={3}
        >
          <CitiesByCountryInput />
        </Stack>
      </Stack>

      {/* <Divider sx={{ borderColor: "text.primary", opacity: "0.1" }} /> */}
      <Grid
        container
        sx={{ mt: 5, mb: 3, py: 3, px: { xs: 3, lg: 0 } }}
        justifyContent={{ lg: "space-around" }}
        rowSpacing={2}
        columnSpacing={2}
      >
        {prayersArray.map((prayer) => (
          <Grid key={prayer.key} size={{ xs: 12, sm: 4, md: 3, lg: 2 }}>
            <Prayer
              name={t(prayer.key.toLowerCase())}
              time={timings[prayer.key]}
              icon={prayer.icon}
            />
          </Grid>
        ))}
      </Grid>
      {/* End Prayers-Cards */}
    </>
  );
}
