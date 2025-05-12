import { useEffect, useState } from "react";
import { fetchAddress } from "../util/http";

// Một số quốc gia và mã ngôn ngữ tương ứng
const countryLanguageMap = {
  "United States": "en",
  USA: "en",
  US: "en",
  "United Kingdom": "en",
  UK: "en",
  Vietnam: "vi",
  "Việt Nam": "vi",
  Japan: "ja",
  "Japan (日本)": "ja",
  日本: "ja",
  China: "zh",
  "China (中国)": "zh",
  中国: "zh",
  Korea: "ko",
  "South Korea": "ko",
  "Korea (한국)": "ko",
  한국: "ko",
  France: "fr",
  Russia: "ru",
  "Russian Federation": "ru",
  Россия: "ru",
  "Saudi Arabia": "sa",
  "المملكة العربية السعودية": "sa",
  saudi: "sa",
};

// Thành phố và ngôn ngữ tương ứng
const cityLanguageMap = {
  Moscow: "ru",
  "Saint Petersburg": "ru",
  Москва: "ru",
  "Санкт-Петербург": "ru",
  Paris: "fr",
  Lyon: "fr",
  Tokyo: "ja",
  東京: "ja",
  Beijing: "zh",
  Shanghai: "zh",
  北京: "zh",
  上海: "zh",
  Seoul: "ko",
  서울: "ko",
  Hanoi: "vi",
  "Ho Chi Minh": "vi",
  "Hà Nội": "vi",
  "Hồ Chí Minh": "vi",
  Riyadh: "sa",
  الرياض: "sa",
};

export function useLocationLanguage() {
  const [locationLanguage, setLocationLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we already have a language stored for this session
    const sessionLanguage = sessionStorage.getItem("detectedLanguage");
    if (sessionLanguage) {
      setLocationLanguage(sessionLanguage);
      setLoading(false);
    }

    // Listen for the custom language changed event
    const handleLanguageChanged = (event) => {
      const { language } = event.detail;
      console.log("Language change event detected:", language);
      setLocationLanguage(language);
      sessionStorage.setItem("detectedLanguage", language);
      setLoading(false);
    };

    // Add event listener for our custom event
    window.addEventListener("languageChanged", handleLanguageChanged);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    // Skip geolocation check if we already have a language from session or from the event
    if (sessionStorage.getItem("detectedLanguage")) {
      return;
    }

    const detectLanguageFromLocation = async () => {
      try {
        setLoading(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const locationName = await fetchAddress(latitude, longitude);
                console.log("Detected location:", locationName); // Debug log

                // Gửi yêu cầu đến Nominatim để lấy thông tin chi tiết hơn
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                );
                const data = await response.json();
                console.log("Nominatim data:", data); // Debug log

                // Lấy tên quốc gia và thành phố
                const country = data.address?.country;
                const city =
                  data.address?.city ||
                  data.address?.town ||
                  data.address?.village;

                // Đặt cờ tìm thấy để theo dõi xem đã tìm được ngôn ngữ chưa
                let languageFound = false;

                // Kiểm tra thành phố trước (ưu tiên cao hơn)
                if (city) {
                  console.log("Detected city:", city); // Debug log

                  // Kiểm tra xem thành phố có trong bản đồ thành phố-ngôn ngữ không
                  if (cityLanguageMap[city]) {
                    setLocationLanguage(cityLanguageMap[city]);
                    console.log(
                      `Set language to ${cityLanguageMap[city]} based on city: ${city}`
                    );
                    languageFound = true;
                  } else {
                    // Tìm kiếm trong tên thành phố có khớp với bất kỳ từ khóa thành phố nào không
                    for (const [cityKey, langCode] of Object.entries(
                      cityLanguageMap
                    )) {
                      if (city.includes(cityKey) || cityKey.includes(city)) {
                        setLocationLanguage(langCode);
                        console.log(
                          `Set language to ${langCode} based on partial city match: ${cityKey} in ${city}`
                        );
                        languageFound = true;
                        break;
                      }
                    }
                  }
                }

                // Nếu không tìm thấy từ thành phố, thử tìm từ quốc gia
                if (!languageFound && country) {
                  console.log("Detected country:", country); // Debug log

                  // Kiểm tra xem quốc gia có trong bản đồ quốc gia-ngôn ngữ không
                  if (countryLanguageMap[country]) {
                    setLocationLanguage(countryLanguageMap[country]);
                    console.log(
                      `Set language to ${countryLanguageMap[country]} based on country: ${country}`
                    );
                    languageFound = true;
                  } else {
                    // Tìm kiếm trong tên quốc gia có khớp với bất kỳ từ khóa quốc gia nào không
                    for (const [countryKey, langCode] of Object.entries(
                      countryLanguageMap
                    )) {
                      if (
                        country.includes(countryKey) ||
                        countryKey.includes(country)
                      ) {
                        setLocationLanguage(langCode);
                        console.log(
                          `Set language to ${langCode} based on partial country match: ${countryKey} in ${country}`
                        );
                        languageFound = true;
                        break;
                      }
                    }
                  }
                }

                // Nếu không tìm thấy từ quốc gia, thử tìm từ locationName tổng thể
                if (!languageFound && locationName) {
                  console.log("Using full locationName:", locationName); // Debug log

                  // Kiểm tra xem locationName có chứa tên thành phố nào không
                  for (const [cityKey, langCode] of Object.entries(
                    cityLanguageMap
                  )) {
                    if (locationName.includes(cityKey)) {
                      setLocationLanguage(langCode);
                      console.log(
                        `Set language to ${langCode} based on city in locationName: ${cityKey}`
                      );
                      languageFound = true;
                      break;
                    }
                  }

                  // Nếu không tìm thấy thành phố, thử tìm quốc gia
                  if (!languageFound) {
                    for (const [countryKey, langCode] of Object.entries(
                      countryLanguageMap
                    )) {
                      if (locationName.includes(countryKey)) {
                        setLocationLanguage(langCode);
                        console.log(
                          `Set language to ${langCode} based on country in locationName: ${countryKey}`
                        );
                        languageFound = true;
                        break;
                      }
                    }
                  }

                  // Kiểm tra một số trường hợp đặc biệt
                  if (!languageFound) {
                    if (
                      locationName.includes("Moscow") ||
                      locationName.includes("Москва")
                    ) {
                      setLocationLanguage("ru");
                      console.log(
                        "Set language to Russian based on Moscow detection"
                      );
                      languageFound = true;
                    }
                  }
                }

                // Mặc định là tiếng Anh nếu không xác định được
                if (!languageFound) {
                  setLocationLanguage("en");
                  console.log("No language match found, defaulting to English");
                }
              } catch (err) {
                console.error("Error fetching location details:", err);
                setError(err.message);
                setLocationLanguage("en");
              } finally {
                setLoading(false);
              }
            },
            (err) => {
              console.error("Error getting geolocation:", err);
              setError(err.message);
              setLocationLanguage("en");
              setLoading(false);
            },
            { timeout: 10000 }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
          setLocationLanguage("en");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error in location detection:", err);
        setError(err.message);
        setLocationLanguage("en");
        setLoading(false);
      }
    };

    detectLanguageFromLocation();
  }, []);

  return { locationLanguage, loading, error };
}
