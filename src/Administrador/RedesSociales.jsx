import React, { useState, useEffect } from 'react';
import {
  TextField,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';

// Redes sociales disponibles
const availableSocials = [
  { label: 'Facebook', name: 'facebook', type: 'url' },
  { label: 'Twitter', name: 'twitter', type: 'url' },
  { label: 'LinkedIn', name: 'linkedin', type: 'url' },
  { label: 'Instagram', name: 'instagram', type: 'url' },
  { label: 'WhatsApp', name: 'whatsapp', type: 'phone' },
];

const RedesSociales = () => {
  const [socialData, setSocialData] = useState({});
  const [selectedSocial, setSelectedSocial] = useState('');
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  // Cargar las redes sociales de la base de datos
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get('https://backendodontologia.onrender.com/api/redesSociales/get');
        setSocialData(response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item.url }), {}));
      } catch (error) {
        console.error('Error al obtener las redes sociales:', error);
      }
    };

    fetchSocials();
  }, []);

  // Manejar la entrada del número de WhatsApp o URL
  const handleInputChange = (e) => {
    if (selectedSocial === 'whatsapp') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 10); // Limitar a 10 dígitos
      setUrl(value);  // No añades `+52` aquí
    } else {
      setUrl(e.target.value);
    }
  };

  const handleSocialSelect = (e) => {
    setSelectedSocial(e.target.value);
    setUrl(''); // Limpiar el campo de URL al seleccionar una nueva red social
  };

  // Validación de URL o número de WhatsApp
  const validateInput = () => {
    if (!url) {
      alert('Por favor, ingresa un enlace o número.');
      return false;
    }

    if (selectedSocial === 'whatsapp') {
      const whatsappRegex = /^\d{10}$/;
      if (!whatsappRegex.test(url)) {
        alert('Por favor ingresa un número de WhatsApp válido con 10 dígitos.');
        return false;
      }
    } else {
      const urlRegex = /^(https?:\/\/)?([a-z0-9]+\.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;
      if (!urlRegex.test(url)) {
        alert('Por favor ingresa un enlace válido.');
        return false;
      }
    }
    return true;
  };

  // Guardar red social (añadir o editar)
  const handleSave = async () => {
    if (validateInput()) {
      try {
        if (isEditing !== null) {
          await axios.put(`https://backendodontologia.onrender.com/api/redesSociales/editar/${isEditing}`, {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,  // Añadir +52 solo si es WhatsApp
          });
          setSocialData({ ...socialData, [selectedSocial]: `+52${url}` });
          setIsEditing(null);
        } else {
          await axios.post('https://backendodontologia.onrender.com/api/redesSociales/nuevo', {
            nombre_red: selectedSocial,
            url: selectedSocial === 'whatsapp' ? `+52${url}` : url,
          });
          setSocialData({ ...socialData, [selectedSocial]: `+52${url}` });
        }
        setSelectedSocial('');
        setUrl('');
      } catch (error) {
        console.error('Error al guardar la red social:', error);
      }
    }
  };

  // Eliminar red social
  const handleDelete = async (social) => {
    try {
      const id = Object.keys(socialData).find(key => key === social);
      await axios.delete(`https://backendodontologia.onrender.com/api/redesSociales/eliminar/${id}`);
      const updatedData = { ...socialData };
      delete updatedData[social];
      setSocialData(updatedData);
    } catch (error) {
      console.error('Error al eliminar la red social:', error);
    }
  };

  // Editar red social
  const handleEdit = (social) => {
    setIsEditing(social);
    setSelectedSocial(social);
    setUrl(socialData[social].replace('+52', '')); // Quita +52 para WhatsApp
  };

  return (
    <Box
      sx={{
        mt: 4,
        backgroundColor: '#fff',
        p: 3,
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Redes Sociales
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <TextField
            select
            label="Selecciona una red social"
            value={selectedSocial}
            onChange={handleSocialSelect}
            fullWidth
          >
            {availableSocials.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label={selectedSocial === 'whatsapp' ? 'Número de WhatsApp' : 'Enlace'}
            value={url}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: selectedSocial === 'whatsapp' && <Typography sx={{ color: 'gray' }}>+52</Typography>, // Visualmente +52
            }}
            helperText={
              selectedSocial === 'whatsapp'
                ? 'Ingresa los 10 dígitos restantes, ej: 1234567890'
                : 'Ingresa el enlace de la red social'
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!selectedSocial || !url}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>

      <List>
        {Object.keys(socialData).map((social) => (
          <ListItem key={social}>
            <ListItemText
              primary={availableSocials.find((s) => s.name === social)?.label || social}
              secondary={socialData[social]}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(social)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(social)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RedesSociales;
