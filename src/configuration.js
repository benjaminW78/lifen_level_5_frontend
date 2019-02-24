module.exports = {
    server: {
        name: 'lifen_level_5_frontend'
    },
    service: {
        backendUrl: process.env.VUE_APP_BACKEND_URL || 'http://localhost:8000'
    }
}