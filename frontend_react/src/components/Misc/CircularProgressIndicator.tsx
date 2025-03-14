import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface CircularProgressIndicatorProps {
    loading: boolean; // Prop to determine if loading
    size?: number; // Optional prop to customize the size of the loader
    color?: 'inherit' | 'primary' | 'secondary'; // Optional prop to customize the color
}

const CircularProgressIndicator: React.FC<CircularProgressIndicatorProps> = ({ loading, size = 40, color = 'primary' }) => {
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
                <CircularProgress size={size} color={color} />
            </Box>
        );
    }

    return null; // Return null if not loading
};

export default CircularProgressIndicator;