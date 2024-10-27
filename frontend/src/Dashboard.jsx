import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Container,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Button,
    Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Dashboard() {
    const [events, setEvents] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('https://calender-1-0k87.onrender.com/api/events', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                if (Array.isArray(res.data)) {
                    setEvents(res.data);
                } else {
                    console.error('Received data is not an array:', res.data);
                    setSnackbarMessage('Unexpected data format');
                    setSnackbarOpen(true);
                }
            } catch (err) {
                console.error(err.response ? err.response.data : err.message);
                setSnackbarMessage('Failed to fetch events');
                setSnackbarOpen(true);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        try {
            await axios.delete(`https://calender-1-0k87.onrender.com/api/events/${eventId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setEvents(events.filter(event => event.id !== eventId));
            setSnackbarMessage('Event deleted successfully');
            setSnackbarOpen(true);
        } catch (err) {
            console.error(err);
            setSnackbarMessage('Failed to delete event');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Your Events</Typography>
            <Link to="/create-event">
                <Button variant="contained" color="primary" className="mb-3">
                    Create Event
                </Button>
            </Link>
            {events.length ? (
                <List>
                    {events.map(event => (
                        <ListItem key={event.id} secondaryAction={
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    component={Link}
                                    to={`/edit-event/${event.id}`}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDelete(event.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }>
                            <ListItemText
                                primary={event.title}
                                secondary={event.date}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No events found</Typography>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default Dashboard;
