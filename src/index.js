import app from './server';

const PORT = 5000;

app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`))