import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Modal, Button, Grid, Container } from '@mui/material';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';

// Redes sociales disponibles con sus iconos
const availableSocials = [
  { label: 'Facebook', name: 'facebook', icon: <FaFacebook /> },
  { label: 'Twitter', name: 'twitter', icon: <FaTwitter /> },
  { label: 'LinkedIn', name: 'linkedin', icon: <FaLinkedin /> },
  { label: 'Instagram', name: 'instagram', icon: <FaInstagram /> },
  { label: 'WhatsApp', name: 'whatsapp', icon: <FaWhatsapp /> },
];

const Footer = () => {
  const [socials, setSocials] = useState([]); // Para almacenar las redes sociales
  const [privacyPolicy, setPrivacyPolicy] = useState([]); // Para políticas de privacidad
  const [termsConditions, setTermsConditions] = useState([]); // Para términos y condiciones
  const [disclaimer, setDisclaimer] = useState([]); // Para el deslinde legal
  const [modalOpen, setModalOpen] = useState(false); // Controlar el modal
  const [modalContent, setModalContent] = useState(''); // Contenido del modal
  const [modalTitle, setModalTitle] = useState(''); // Título del modal

  // Obtener redes sociales
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/redesSociales/sociales');
        setSocials(response.data);
      } catch (error) {
        console.error('Error al obtener las redes sociales', error);
      }
    };

    // Obtener políticas de privacidad activas
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/politicas/politicas_privacidad');
        const activePolicy = response.data.filter(policy => policy.estado === 'activo');
        setPrivacyPolicy(activePolicy);
      } catch (error) {
        console.error('Error al obtener las políticas de privacidad', error);
      }
    };

    // Obtener términos y condiciones activos
    const fetchTermsConditions = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/termiCondicion/terminos_condiciones');
        const activeTerms = response.data.filter(term => term.estado === 'activo');
        setTermsConditions(activeTerms);
      } catch (error) {
        console.error('Error al obtener los términos y condiciones', error);
      }
    };

    // Obtener deslinde legal activo
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

  // Abrir modal con el contenido seleccionado
  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <footer style={{ backgroundColor: '#00bcd4', color: '#ffffff', padding: '10px 0', textAlign: 'center', position: 'fixed', width: '100%', bottom: 0 }}>
      <Container>
        <Grid container spacing={4}>
          {/* Columna 1: Redes sociales y contacto */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Síguenos en redes sociales
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
              {socials.map((social) => {
                const socialIcon = availableSocials.find((s) => s.name === social.nombre_red)?.icon;
                return (
                  socialIcon && (
                    <IconButton
                      key={social.id}
                      component="a"
                      href={social.url ? `https://${social.url}` : `tel:${social.url}`} // Enlace a URL o teléfono
                      sx={{ color: '#ffffff', fontSize: '1.5rem' }} // Tamaño reducido del icono
                    >
                      {socialIcon}
                    </IconButton>
                  )
                );
              })}
            </Box>
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
              Contáctanos a través de nuestras redes sociales o llámanos directamente.
            </Typography>
          </Grid>

          {/* Columna 2: Enlaces legales */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Información Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Button
                onClick={() => handleOpenModal('Política de Privacidad', privacyPolicy[0]?.contenido || 'No disponible')}
                sx={{ color: '#ffffff', textAlign: 'left', fontSize: '0.9rem' }} // Tamaño reducido del texto
              >
                Política de Privacidad
              </Button>
              <Button
                onClick={() => handleOpenModal('Términos y Condiciones', termsConditions[0]?.contenido || 'No disponible')}
                sx={{ color: '#ffffff', textAlign: 'left', fontSize: '0.9rem' }}
              >
                Términos y Condiciones
              </Button>
              <Button
                onClick={() => handleOpenModal('Deslinde Legal', disclaimer[0]?.contenido || 'No disponible')}
                sx={{ color: '#ffffff', textAlign: 'left', fontSize: '0.9rem' }}
              >
                Deslinde Legal
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Typography sx={{ mt: 1, fontSize: '0.75rem' }}>© 2024 Tu Compañía. Todos los derechos reservados.</Typography>

      {/* Modal para mostrar políticas, términos y deslinde */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ backgroundColor: '#fff', padding: 2, margin: 'auto', marginTop: '10%', maxWidth: 600 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {modalTitle}
          </Typography>
          <Typography>{modalContent}</Typography>
          <Button onClick={handleCloseModal} sx={{ mt: 2 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </footer>
  );
};

export default Footer;
