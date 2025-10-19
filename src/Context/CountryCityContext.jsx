import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CountryCityContext = createContext();

export const CountryCityProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState({ country: "Egypt" });
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // get All Countries
  const getCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const countryList = response.data.data.map((c) => ({
        country: c.country,
      }));
      setCountries(countryList);
      // console.log(response.data.data);
      //default : Egypt
      const egypt = countryList.find((c) => c.country === "Egypt");
      if (egypt) setCountry(egypt);
    } catch (error) {
      console.error("Error Fetching Countries: ", error);
    } finally {
      setLoadingCountries(false);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);

  // get cities depend on choose country
  const getCities = async (selectCountry) => {
    if (!selectCountry) {
      setCities([]);
      setSelectedCity(""); // reset city if no country
      return;
    }
    setLoadingCities(true);
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        { country: selectCountry.country }
      );
      const citiesList = res.data.data.map((c) => c.toLowerCase());
      setCities(citiesList);
      console.log(citiesList);
      // default city
      if (selectCountry.country === "Egypt") {
        if (citiesList.includes("cairo")) {
          setSelectedCity("cairo");
        } else {
          setSelectedCity(citiesList[0]);
        }
      } else {
        setTimeout(() => {
          // set first city only after cities are loaded
          setSelectedCity(citiesList[0] || ""); 
        }, 100);
      }
    } catch (error) {
      console.error("Error Fetcing Cities : ", error);
      setCities([]);
      setSelectedCity("");
    } finally {
      setLoadingCities(false);
    }
  };
  useEffect(() => {
    if (country) {
      getCities(country);
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [country]);
  // console.log(selectedCity);
  return (
    <CountryCityContext.Provider
      value={{
        country,
        setCountry,
        selectedCity,
        setSelectedCity,
        countries,
        cities,
        loadingCities,
        loadingCountries,
      }}
    >
      {children}
    </CountryCityContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCountryCity = () => useContext(CountryCityContext);
