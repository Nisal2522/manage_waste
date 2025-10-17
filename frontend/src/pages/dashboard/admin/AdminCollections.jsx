import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';

const AdminCollections = () => {
  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(45deg, #10b981, #059669)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Collections Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Data from ManageWaste.collections table
            </Typography>
          </Box>
        </Paper>

        {/* Empty Content */}
        <Paper elevation={0} sx={{ 
          p: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="text.secondary">
            Collections page is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Ready for new implementation
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminCollections;