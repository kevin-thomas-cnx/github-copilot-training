function fn() {
    const port = karate.properties['karate.port'] || '8080';
    const config = {
        baseUrl: 'http://localhost:' + port
    };
    karate.log('Using baseUrl:', config.baseUrl);
    return config;
}
