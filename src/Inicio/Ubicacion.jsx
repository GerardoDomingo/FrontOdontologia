import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader 
} from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { LocationOn, OpenInNew } from '@mui/icons-material';
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

  const center = {
    lat: 21.081734,
    lng: -98.536002
  };

    // Google Maps Street View link
    const streetViewLink = `https://www.google.com/maps/@21.0816681,-98.5359763,19.64z`;

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
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        sx={{ 
          backgroundColor: colors.cardBackground,
          borderRadius: '8px',
          boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ 
            color: colors.primaryColor,
            mb: 2
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.secondaryText,
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
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
        {/* Mantener el título y descripción existentes... */}

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

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mt: 3 
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.secondaryText,
              textAlign: 'center',
              fontFamily: 'Roboto, sans-serif',
              transition: 'color 0.3s ease',
              mb: 2
            }}
          >
            <strong style={{ color: colors.primaryText }}>
              Dirección:
            </strong> Ixcatlan, Huejutla de Reyes, Hidalgo, México.
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            href={streetViewLink}
            target="_blank"
            startIcon={<OpenInNew />}
            sx={{
              mt: 2,
              textTransform: 'none',
              borderColor: colors.primaryColor,
              color: colors.primaryColor,
              '&:hover': {
                borderColor: colors.primaryColor,
                backgroundColor: isDarkMode ? 'rgba(0, 188, 212, 0.08)' : 'rgba(25, 118, 210, 0.08)',
              },
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500
            }}
          >
            Abrir en Google Maps
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Ubicacion;