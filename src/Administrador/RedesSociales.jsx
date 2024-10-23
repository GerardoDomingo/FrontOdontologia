import React, { useState } from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

const RedesSociales = () => {
    const [socialData, setSocialData] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSocialData({
            ...socialData,
            [name]: value,
        });
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Redes Sociales
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Facebook"
                        name="facebook"
                        value={socialData.facebook}
                        onChange={handleInputChange}
                        helperText="Enlace a Facebook"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Twitter"
                        name="twitter"
                        value={socialData.twitter}
                        onChange={handleInputChange}
                        helperText="Enlace a Twitter"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="LinkedIn"
                        name="linkedin"
                        value={socialData.linkedin}
                        onChange={handleInputChange}
                        helperText="Enlace a LinkedIn"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Instagram"
                        name="instagram"
                        value={socialData.instagram}
                        onChange={handleInputChange}
                        helperText="Enlace a Instagram"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default RedesSociales;
