import React, { useState } from 'react';
import GCPConfigService from '../services/GCPConfigService';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';

type ProjectDetails = {
    projectId?: string;
    projectName?: string;
    projectDescription?: string;
};

type GCPConfigManagerProps = {
    initialProjectDetails?: ProjectDetails;
    onSuccess?: (data: any) => void;
};

const GCPConfigManager: React.FC<GCPConfigManagerProps> = ({
    initialProjectDetails = {},
    onSuccess,
}) => {
    const [projectId, setProjectId] = useState(initialProjectDetails.projectId || '');
    const [projectName, setProjectName] = useState(initialProjectDetails.projectName || '');
    const [projectDescription, setProjectDescription] = useState(initialProjectDetails.projectDescription || '');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!projectId.trim() || !projectName.trim()) {
            setError('Project ID and Project Name are required.');
            return;
        }

        setLoading(true);
        try {
            const result = await GCPConfigService.createProject({ projectId,  projectName, projectDescription });
            if (onSuccess) onSuccess(result);
        } catch (err: any) {
            setError(err.message || 'Failed to create project.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '50vw',
            maxWidth: '50vw',
            mx: 'auto',
            my: 4,
            px: 2,
            }}
        >
            <TextField
            label="Project ID*"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            required
            variant="outlined"
            fullWidth
            />
            <TextField
            label="Project Name*"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            required
            variant="outlined"
            fullWidth
            />
            <TextField
            label="Project Description"
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            />
            {error && (
            <Typography color="error" variant="body2">
                {error}
            </Typography>
            )}
            <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            >
            {loading ? 'Submitting...' : 'Submit'}
            </Button>
        </Box>
    );
};

export default GCPConfigManager;