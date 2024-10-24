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
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const availableSocials = [
  { label: 'Facebook', name: 'facebook' },
  { label: 'Twitter', name: 'twitter' },
  { label: 'LinkedIn', name: 'linkedin' },
  { label: 'Instagram', name: 'instagram' },
  { label: 'WhatsApp', name: 'whatsapp' },
];

const RedesSociales = ({ id_empresa }) => {
  const [socialData, setSocialData] = useState({});
  const [selectedSocial, setSelectedSocial] = useState('');
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(null); // Track editing index

  // Cargar redes sociales al montar el componente
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await axios.get(`https://backendodontologia.onrender.com/api/redesSociales/${id_empresa}`);
        setSocialData(response.data.reduce((acc, item) => ({ ...acc, [item.nombre_red]: item.url }), {}));
      } catch (error) {
        console.error('Error al obtener las redes sociales:', error);
      }
    };

    fetchSocials();
  }, [id_empresa]);

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSocialSelect = (e) => {
    setSelectedSocial(e.target.value);
  };

  const validateAndSave = async () => {
    if (selectedSocial && url) {
      try {
        await axios.post('https://backendodontologia.onrender.com/api/redesSociales/nuevo', {
          id_empresa,
          nombre_red: selectedSocial,
          url,
        });
        setSocialData({ ...socialData, [selectedSocial]: url });
        setSelectedSocial('');
        setUrl('');
      } catch (error) {
        console.error('Error al agregar la red social:', error);
      }
    } else {
      alert('Por favor ingresa un enlace válido.');
    }
  };

  const handleDelete = async (social) => {
    try {
      const socialId = Object.keys(socialData).find(key => key === social);
      await axios.delete(`https://backendodontologia.onrender.com/api/redesSociales/${socialId}`);
      const updatedData = { ...socialData };
      delete updatedData[social];
      setSocialData(updatedData);
    } catch (error) {
      console.error('Error al eliminar la red social:', error);
    }
  };

  const handleEdit = (social) => {
    setIsEditing(social);
    setSelectedSocial(social);
    setUrl(socialData[social]);
  };

  const saveEdit = async () => {
    if (url) {
      try {
        const socialId = Object.keys(socialData).find(key => key === selectedSocial);
        await axios.put(`https://backendodontologia.onrender.com/api/redesSociales/${socialId}`, {
          nombre_red: selectedSocial,
          url,
        });
        setSocialData({ ...socialData, [selectedSocial]: url });
        setSelectedSocial('');
        setUrl('');
        setIsEditing(null);
      } catch (error) {
        console.error('Error al editar la red social:', error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
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
            label="Enlace"
            value={url}
            onChange={handleInputChange}
            helperText="Ingresa el enlace de la red social"
          />
        </Grid>

        <Grid item xs={12}>
          {isEditing !== null ? (
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={saveEdit}>
              Guardar Edición
            </Button>
          ) : (
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={validateAndSave}>
              Añadir
            </Button>
          )}
        </Grid>
      </Grid>

      <List>
        {Object.keys(socialData).map((social) => (
          <ListItem key={social}>
            <ListItemText primary={availableSocials.find((s) => s.name === social).label} secondary={socialData[social]} />
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
