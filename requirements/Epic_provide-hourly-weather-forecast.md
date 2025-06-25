# CMWA-16_Epic_provide-hourly-weather-forecast

## Overview
Offer users hourly weather forecasts for the next 24 hours, including temperature, precipitation, and weather conditions, to help them prepare for short-term weather changes.

## User Story
AS A user  
I WANT to see hourly weather forecasts for the next 24 hours  
SO THAT I can prepare for short-term weather changes

## Acceptance Criteria
- Display temperature predictions for the next 24 hours for the user’s current location.
- Show hourly precipitation forecasts.
- Include hourly weather conditions (e.g., cloudy, rainy).
- Add a tab to the UI for the current day forecast. If tabs do not already exist, ensure any current feature screens are provided with their own tabs.
    - This feature should be the first tab displayed when the application is started.

## Technical Dependencies
- Use the https://open-meteo.com/ API for the daily forecast.
- Determine the user’s location using the web browser location API.

---

## Guidance for User Story Breakdown

1. **API Endpoint:**
    - Implement a RESTful API endpoint for retrieving the next 24 hours of hourly weather data for a given location.
    - Specify URI parameters, request/response bodies, and HTTP status codes.
    - Ensure robust error handling for missing/invalid parameters and upstream API failures.

2. **Location Retrieval:**
    - Implement functionality to retrieve the user's location using the web browser's location API.
    - Handle all error scenarios (e.g., permission denied, unavailable, or failure) and provide a fallback for manual location entry.

3. **Hourly Forecast Data Hook & Display:**
    - Create a React hook for requesting the hourly weather forecast from the API.
    - Develop a React component to display the hourly forecast, including temperature, precipitation, and weather conditions.
    - Ensure all API response scenarios (success, error, loading, empty) are handled in the UI.

4. **Tabbed Navigation:**
    - Implement tabbed navigation in the UI, with one tab for the current day's hourly forecast and another for a 7-day forecast.
    - The "Today" (hourly) tab should be the default on app start.
    - Each tab should display its respective forecast data and handle loading/error states.
