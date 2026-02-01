import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import Card from "../components/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

import { countryData, fetchCountry } from "../api/countries";
import { fetchCitiesByCountry } from "../api/cities";
import { getUnsplashImage } from "../api/unsplash"; // Import helper
import CityMap from "../components/CityMap";
import SEO from "../components/SEO";

/* =======================
   COMPONENT
======================= */

const Country = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // 1. Get Static / Fallback Data
  const staticData = countryData[countryName?.toLowerCase()];

  // 2. State for Dynamic API Data
  const [apiData, setApiData] = useState(null);
  const [dynamicCities, setDynamicCities] = useState([]);
  const [countryImage, setCountryImage] = useState(null); // State for country hero image
  const [dynamicCategories, setDynamicCategories] = useState([]); // State for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCountryData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch API data (no merge happens in the function anymore)
        const data = await fetchCountry(countryName);
        setApiData(data);

        // Fetch Main Country Image (Async)
        getUnsplashImage(`${data.apiData.name.common} country landmark`).then(img => {
            if (img) setCountryImage(img);
        });

        // Calculate if we need to fetch cities (only if static cities are missing)
        const hasStaticCities = staticData?.cities?.length > 0;
        
        if (!hasStaticCities && data?.apiData?.name?.common) {
             fetchCitiesByCountry(data.apiData.name.common, data.apiData.cca2).then(setDynamicCities);
        }

        // Initialize and fetch categories images
        const defaults = [
          { name: "Culture", query: "culture tradition", description: "Heritage, arts, and local traditions", featured: true },
          { name: "Nature", query: "nature landscape", description: "Scenic landscapes and natural wonders" },
          { name: "Food", query: "food cuisine", description: "Local cuisine and culinary delights" },
          { name: "Adventure", query: "adventure travel", description: "Outdoor activities and exploration" }
        ];

        // Fetch category images in parallel
        Promise.all(defaults.map(async (cat) => {
            const img = await getUnsplashImage(`${data.apiData.name.common} ${cat.query}`);
            return {
                ...cat,
                image: img || `https://loremflickr.com/800/600/${data.apiData.name.common},${cat.name.toLowerCase()}`, // Fallback
            };
        })).then(setDynamicCategories);

      } catch (err) {
        // If API fails, we just won't have the extra stats, but we might still show static data if available
        console.error("API Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (countryName) {
      getCountryData();
    }
  }, [countryName]);



  // Combined Data (Static takes precedence for visuals, API for stats)
  const citiesToUse = staticData?.cities && staticData.cities.length > 0 
    ? [...staticData.cities] 
    : (dynamicCities.length > 0 ? [...dynamicCities] : []);

  // Fallback Generation if no cities found (e.g. API limit or error)
  // We only show the Capital to avoid generic/repetitive placeholders
  if (citiesToUse.length === 0 && apiData) {
      citiesToUse.push({
          name: apiData.capital || "Capital City",
          image: `https://loremflickr.com/800/600/${apiData.capital || countryName},city`,
          description: `The bustling heart of ${apiData.name}, full of history and life.`,
          lat: apiData.capitalInfo?.latlng?.[0], 
          lon: apiData.capitalInfo?.latlng?.[1]
      });
  }

  const categoriesToUse = staticData?.categories || (dynamicCategories.length > 0 ? dynamicCategories : []);

  const country = {
      ...staticData,
      ...apiData, // API overrides matching keys (capital, region, population)
      // Ensure visual fields fall back effectively
      description: staticData?.description || (apiData ? `Explore ${apiData.name} located in ${apiData.subregion || apiData.region}.` : ""),
      // Use fetched countryImage, then staticData, then LoremFlickr fallback
      image: countryImage || staticData?.image || (apiData ? `https://loremflickr.com/1600/900/${apiData.name},landmark` : ""), 
      cities: citiesToUse, // Now guaranteed to have content if apiData exists
      categories: categoriesToUse
  };

  // If we have neither static nor dynamic data loaded yet (and loading is done), or error
  if (!staticData && !apiData && !loading) {
     return (
        <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination not found</h2>
                <Link to="/" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition">Go Home</Link>
            </div>
        </div>
     );
  }

  if (loading) {
    return (
       <div className="flex-grow flex items-center justify-center bg-white">
         <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading destination details...</p>
         </div>
       </div>
    );
 }

  return (
    <div className="bg-gray-50 flex-grow">
      {/* HERO */}
      {/* HERO */}
      {/* HERO */}
      {/* HERO SECTION - FRESH LOOK */}
      <section className="relative h-[50vh] min-h-[400px] md:min-h-[480px] flex items-center justify-center">
        <SEO 
          title={`Visit ${country.name} - Travel Guide & Tips`}
          description={country.description || `Discover the best places to visit in ${country.name}. Plan your trip with our comprehensive guide.`}
          image={country.image}
        />
        <div className="absolute inset-0">
          <img
            src={country.image}
            alt={country.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center text-white flex flex-col items-center justify-center h-full pb-20 md:pb-0">
          <h1 className="text-3xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-2xl">
            {country.name}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 font-medium leading-relaxed drop-shadow-md mb-8">
            {country.description}
          </p>



          {/* EXPLORE CUE - NOW INSIDE FLOW */}
          <div className="mt-10 flex flex-col items-center gap-2 text-white/80 animate-bounce pointer-events-none">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-100">Scroll to explore destinations</span>
              <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
        </div>
      </section>

      {/* STATS STRIP - FLOATING CARD */}
      <section className="relative z-30 px-4">
        <div className="max-w-7xl mx-auto -mt-12 md:-mt-16 p-5 md:p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 sm:gap-6 md:gap-x-12 md:gap-y-8 text-gray-800">
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Region</span>
                  <span className="text-lg font-bold text-gray-900">{country.subregion || country.region}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 0v-3"></path></svg>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Capital</span>
                  <span className="text-lg font-bold text-gray-900">{country.capital}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Population</span>
                  <span className="text-lg font-bold text-gray-900">{(country.population / 1000000).toFixed(1)}M</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                <div>
                  <span className="block text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Known For</span>
                  <span className="text-lg font-bold text-gray-900">Culture & Heritage</span>
                </div>
              </div>

            </div>

            <div className="hidden lg:block w-px h-12 bg-gray-100 mx-4" />

            <button 
              onClick={() => {
                document.getElementById('country-map')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cursor-pointer group w-full lg:w-auto flex flex-shrink-0 items-center justify-center gap-3 px-6 py-3.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-100 active:scale-95"
            >
              <span className="whitespace-nowrap">View on Map</span> 
              <svg className="w-4 h-4 text-teal-100 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"></path></svg>
            </button>
          </div>
        </div>
      </section>

      {/* COUNTRY SNAPSHOT */}
      {/* <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              Discover {country.name}
            </h2>

            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              {country.name} is shaped by centuries of history, regional
              cultures, and diverse landscapes — from dense cities and ancient
              landmarks to coastlines, mountains, and rural traditions.
            </p>
          </div> */}

      {/* FACT STRIP */}
      {/* <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t pt-8">
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="font-medium text-gray-900">South Asia</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Capital</p>
              <p className="font-medium text-gray-900">New Delhi</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Best time to visit</p>
              <p className="font-medium text-gray-900">October – March</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Known for</p>
              <p className="font-medium text-gray-900">
                Culture, history, food
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CITIES */}
      {/* POPULAR CITIES with PLANNING FLOW */}

      <section id="cities" className="pt-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="w-full md:w-auto text-center md:text-left">

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose your destination</h2>
              <p className="text-gray-500 mt-2">Select a city to explore guides and itineraries</p>
            </div>
            
            <Link
                  to={`/country/${countryName}/cities`}
                  className="hidden md:flex text-teal-600 font-semibold hover:text-teal-700 transition items-center gap-1"
                >
                  View all <span aria-hidden="true">&rarr;</span>
                </Link>
          </div>

          {/* SWIPER VIEW (DEFAULT) */}
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
                640: {
                slidesPerView: 2.2,
                spaceBetween: 24,
                },
                1024: {
                slidesPerView: 3.2,
                spaceBetween: 24,
                },
                1280: {
                slidesPerView: 4,
                spaceBetween: 24,
                },
            }}
            className="!pb-10"
            >
            {country.cities?.map((city) => (
                <SwiperSlide key={city.name} className="!h-auto pb-1">
                <Link to={`/country/${countryName}/city/${city.name.toLowerCase()}`} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                        Trending
                        </span>
                    </div>

                    
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>5 Popular Spots</span>
                        </div>
                    </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                        <p className="text-gray-600 text-base leading-relaxed mb-6 flex-grow line-clamp-3">
                             {city.description}
                        </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-gray-900 font-medium text-sm">Explore Guide</span>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist({
                                    id: city.name,
                                    type: 'city',
                                    name: city.name,
                                    image: city.image,
                                    country: countryName
                                });
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isInWishlist(city.name, 'city') 
                                ? 'bg-red-50 text-red-500' 
                                : 'bg-teal-50 text-teal-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                        >
                             <svg className="w-5 h-5" fill={isInWishlist(city.name, 'city') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    </div>
                    </div>
                </Link>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
      </section>

      {/* EXPLORE BY CATEGORY */}
      <section className="pt-10 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div className="w-full text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Explore by category
              </h2>
              <p className="mt-2 text-gray-600 text-lg">
                Dive deep into what makes {country.name} unique.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
            {country.categories?.map((cat, index) => (
              <div
                key={cat.name}
                onClick={() => navigate(`/explore/${cat.name.toLowerCase()}`)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-3" : "col-span-1"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${cat.isMap ? 'opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100' : ''}`}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity ${cat.isMap ? 'from-teal-900/90 via-teal-900/40 to-transparent' : 'from-black/90 via-black/30 to-transparent opacity-90'}`} />

                {/* Map Icon Overlay */}
                {cat.isMap && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"></path></svg>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className={`font-bold tracking-wider uppercase mb-2 ${index === 0 ? 'text-sm text-teal-400' : 'text-xs text-teal-300'}`}>
                      {index === 0 ? 'Featured Collection' : cat.isMap ? 'Interactive' : 'Discover'}
                    </p>
                    <h3 className={`text-white font-bold mb-2 leading-tight ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                      {cat.name}
                    </h3>
                    <p className={`text-gray-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ${index === 0 ? 'text-lg max-w-md' : 'text-xs line-clamp-2'}`}>
                      {cat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP SECTION - VISUAL & IMMERSIVE */}
      {/* MAP SECTION - VISUAL & IMMERSIVE */}
      {/* MAP SECTION - VISUAL & IMMERSIVE */}
      <section id="country-map" className="max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 border-t border-gray-200 scroll-mt-20">
         
         {/* Map */}
         <div className="lg:w-3/5">
            <div className="mb-6">
               <h3 className="text-2xl font-bold text-gray-900">Explore places on the map</h3>
               <p className="text-gray-500">View major cities and destinations geographically.</p>
            </div>
            
            <div className="relative w-full max-w-full h-[350px] lg:h-[500px] rounded-3xl overflow-hidden shadow-lg bg-gray-200 group">
               {country.latlng ? (
                   <CityMap 
                      center={country.latlng} 
                      cityName={country.name}
                      places={country.cities.map(c => ({
                          ...c,
                          descriptor: "Major City",
                          link: `/country/${countryName}/city/${c.name.toLowerCase()}`
                      }))} 
                   />
               ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                      Map data unavailable
                  </div>
               )}
            </div>
         </div>

         {/* Destinations List (Equivalent to Practical Tips style from City Page) */}
         <div className="lg:w-2/5 flex flex-col justify-center">
            <div className="bg-teal-50 rounded-3xl p-8 border border-teal-100/50">
               <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="p-2 bg-teal-100 rounded-lg text-teal-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </span>
                  Top Destinations
               </h3>

               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {country.cities && country.cities.length > 0 ? (
                      country.cities.slice(0, 6).map((city, idx) => (
                         <Link 
                            to={`/country/${countryName}/city/${city.name.toLowerCase()}`}
                            key={city.name} 
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                         >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-gray-900 font-bold group-hover:text-teal-700 transition-colors">{city.name}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{city.description}</p>
                            </div>
                            <div className="ml-auto text-gray-400 group-hover:text-teal-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                         </Link>
                      ))
                  ) : (
                      <p className="text-gray-500">Major cities listed here.</p>
                  )}
                  
                  <Link to={`/country/${countryName}/cities`} className="block text-center mt-4 text-sm font-bold text-teal-700 hover:text-teal-800 uppercase tracking-wider">
                      View All Cities
                  </Link>
               </div>
            </div>
         </div>

      </section>


    </div>
  );
};

export default Country;
