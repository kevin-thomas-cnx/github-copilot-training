Feature: Locations Search API

  Background:
    * configure headers = { Accept: 'application/json' }

  Scenario: Search for locations by city name (success)
    Given url 'http://localhost:8080/api/v1/locations/search?query=Boston'
    When method get
    Then status 200
    # Fuzzy match: Boston present, latitude/longitude are numbers (float tolerant)
    And match response.locations[0].name == 'Boston'
    And match response.locations[0].latitude == '#number'
    And match response.locations[0].longitude == '#number'
    # Optionally, check that latitude/longitude are within valid ranges
    And match response.locations[0].latitude == '#? _ >= -90 && _ <= 90'
    And match response.locations[0].longitude == '#? _ >= -180 && _ <= 180'

  Scenario: Search for locations with missing query (error)
    Given url 'http://localhost:8080/api/v1/locations/search'
    When method get
    Then status 400
    And match response.error contains 'Missing'

  Scenario: Search for locations with no results (error)
    Given url 'http://localhost:8080/api/v1/locations/search?query=NoSuchCity'
    When method get
    Then status 404
    And match response.error contains 'No locations found'
