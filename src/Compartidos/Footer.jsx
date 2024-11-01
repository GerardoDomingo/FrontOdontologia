import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Modal, Button, Grid, Container, Divider } from '@mui/material';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

const availableSocials = [
  { label: 'Facebook', name: 'facebook', icon: <FaFacebook /> },
  { label: 'Twitter', name: 'twitter', icon: <FaTwitter /> },
  { label: 'LinkedIn', name: 'linkedin', icon: <FaLinkedin /> },
  { label: 'Instagram', name: 'instagram', icon: <FaInstagram /> },
  { label: 'WhatsApp', name: 'whatsapp', icon: <FaWhatsapp /> },
];

const Footer = () => {
  const [socials, setSocials] = useState([]);
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [disclaimer, setDisclaimer] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar el tema del sistema
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

  // Obtener datos del backend
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/redesSociales/sociales');
        setSocials(response.data);
      } catch (error) {
        console.error('Error al obtener las redes sociales', error);
      }
    };

    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/politicas_privacidad');
        const activePolicy = response.data.filter(policy => policy.estado === 'activo');
        setPrivacyPolicy(activePolicy);
      } catch (error) {
        console.error('Error al obtener las políticas de privacidad', error);
      }
    };

    const fetchTermsConditions = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/termiCondicion/terminos_condiciones');
        const activeTerms = response.data.filter(term => term.estado === 'activo');
        setTermsConditions(activeTerms);
      } catch (error) {
        console.error('Error al obtener los términos y condiciones', error);
      }
    };

    const fetchDisclaimer = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/deslinde/deslinde');
        const activeDisclaimer = response.data.filter(disclaimer => disclaimer.estado === 'activo');
        setDisclaimer(activeDisclaimer);
      } catch (error) {
        console.error('Error al obtener el deslinde legal', error);
      }
    };

    fetchSocials();
    fetchPrivacyPolicy();
    fetchTermsConditions();
    fetchDisclaimer();
  }, []);

  // Manejar la apertura y cierre del modal
  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <footer
      style={{
        backgroundColor: isDarkMode ? '#0D1B2A' : '#00BCD4', // Fondo diferente en tema oscuro
        color: '#ffffff',
        padding: '20px 0',
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Container>
        <Grid container spacing={4}>
          {/* Columna 1: Acerca de Carol */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Acerca de Carol</Typography>
            <Button sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}>
              Información sobre nuestra empresa
            </Button>
            <Divider sx={{ backgroundColor: '#ffffff', my: 1, opacity: 0.5 }} />
          </Grid>

          {/* Columna 2: Servicio al Cliente */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Servicio al Cliente</Typography>
            <Button sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}>
              Preguntas frecuentes
            </Button>
            <Button sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}>
              Contáctanos
            </Button>
            <Divider sx={{ backgroundColor: '#ffffff', my: 1, opacity: 0.5 }} />
          </Grid>

          {/* Columna 3: Normatividad */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Normatividad</Typography>
            <Button
              onClick={() => handleOpenModal('Política de Privacidad', privacyPolicy[0]?.contenido || 'No disponible')}
              sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}
            >
              Política de Privacidad
            </Button>
            <Button
              onClick={() => handleOpenModal('Términos y Condiciones', termsConditions[0]?.contenido || 'No disponible')}
              sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}
            >
              Términos y Condiciones
            </Button>
            <Button
              onClick={() => handleOpenModal('Deslinde Legal', disclaimer[0]?.contenido || 'No disponible')}
              sx={{ color: '#ffffff', fontSize: '0.85rem', textAlign: 'left' }}
            >
              Deslinde Legal
            </Button>
            <Divider sx={{ backgroundColor: '#ffffff', my: 1, opacity: 0.5 }} />
          </Grid>

          {/* Columna 4: Redes Sociales */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Síguenos en redes sociales</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
              {socials.map((social) => {
                const socialIcon = availableSocials.find((s) => s.name === social.nombre_red)?.icon;
                return (
                  socialIcon && (
                    <IconButton
                      key={social.id}
                      component="a"
                      href={social.url ? `https://${social.url}` : `tel:${social.url}`}
                      sx={{ color: '#ffffff', fontSize: '1.5rem' }}
                    >
                      {socialIcon}
                    </IconButton>
                  )
                );
              })}
            </Box>
            <Divider sx={{ backgroundColor: '#ffffff', my: 1, opacity: 0.5 }} />
          </Grid>
        </Grid>
        <Typography sx={{ mt: 2, fontSize: '0.7rem' }}>© 2024 Odontologia Carol. Todos los derechos reservados.</Typography>
      </Container>

      {/* Modal para mostrar políticas, términos y deslinde */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            backgroundColor: '#fff',
            padding: 3,
            margin: 'auto',
            marginTop: '10%',
            maxWidth: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{modalTitle}</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{modalContent}</Typography>
          <Button
            onClick={handleCloseModal}
            sx={{ mt: 3, backgroundColor: '#00BCD4', color: '#ffffff', '&:hover': { backgroundColor: '#0097a7' } }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </footer>
  );
};

export default Footer;
