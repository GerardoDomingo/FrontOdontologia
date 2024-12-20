import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { LocationOn } from '@mui/icons-material';

const Ubicacion = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const matchDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(matchDarkTheme.matches);

    const handleThemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    matchDarkTheme.addEventListener('change', handleThemeChange);

    return () => {
      matchDarkTheme.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Theme-dependent colors
  const colors = {
    cardBackground: isDarkMode ? '#0D1B2A' : '#ffffff',
    primaryText: isDarkMode ? '#ffffff' : '#1a1a1a',
    secondaryText: isDarkMode ? '#A0AEC0' : '#666666',
    primaryColor: isDarkMode ? '#00BCD4' : '#1976d2',
  };

  // Map coordinates
  const center = {
    lat: 21.081734,
    lng: -98.536002
  };

  const mapStyles = {
    height: "400px",
    width: "100%",
    borderRadius: "8px",
    marginTop: "20px"
  };

  // Custom map styles for dark mode
  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
  ];

  const mapContainerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCjYgHzkG53-aSTcHJkAPYu98TIkGZ2d-w"
  });

  if (!isLoaded) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        sx={{ backgroundColor: colors.cardBackground }}
      >
        <Typography variant="h6" sx={{ color: colors.secondaryText }}>
          Cargando mapa...
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      variants={mapContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        component="section"
        sx={{
          backgroundColor: colors.cardBackground,
          py: 8,
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          mb: 5,
          px: 3,
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: colors.primaryColor,
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            fontFamily: 'Montserrat, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            transition: 'color 0.3s ease'
          }}
        >
          <LocationOn 
            sx={{ 
              fontSize: 35, 
              color: colors.primaryColor,
              transition: 'color 0.3s ease'
            }} 
          />
          Ubicación
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: colors.secondaryText,
            textAlign: 'center',
            mb: 4,
            fontFamily: 'Roboto, sans-serif',
            transition: 'color 0.3s ease'
          }}
        >
          Encuéntranos en nuestra ubicación exacta en Huejutla de Reyes, Hidalgo, México.
        </Typography>

        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={17}
          center={center}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: isDarkMode ? darkMapStyle : [],
            backgroundColor: isDarkMode ? '#242f3e' : '#ffffff'
          }}
        >
          <Marker
            position={center}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: colors.primaryColor,
              fillOpacity: 1,
              strokeWeight: 0
            }}
          />
        </GoogleMap>

        <Typography
          variant="body2"
          sx={{
            color: colors.secondaryText,
            textAlign: 'center',
            mt: 3,
            fontFamily: 'Roboto, sans-serif',
            transition: 'color 0.3s ease'
          }}
        >
          <strong style={{ color: colors.primaryText }}>Dirección:</strong> Ixcatlan, Huejutla de Reyes, Hidalgo, México.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Ubicacion;