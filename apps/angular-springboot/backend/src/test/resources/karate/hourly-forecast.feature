Feature: Hourly Forecast API

  Scenario: Get hourly forecast (success)
    Given url 'http://localhost:8080/api/v1/forecast/hourly?lat=42.36&lon=-71.06'
    And header Accept = 'application/json'
    When method get
    Then status 200
    And match response.hourly == '#[24]'
    * def checkHourly =
    """
    function(arr) {
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (!karate.match(x, { hour: '#number', temperature: '#number', precipitationChance: '#number' }).pass) return false;
        if (!karate.match(x.temperature, '#number').pass) return false;
        if (!karate.match(x.precipitationChance, '#number').pass) return false;
      }
      return true;
    }
    """
    * if (karate.typeOf(response.hourly) == 'array') karate.call(checkHourly, response.hourly)

  Scenario: Missing lat parameter (error)
    Given url 'http://localhost:8080/api/v1/forecast/hourly?lon=-71.06'
    And header Accept = 'application/json'
    When method get
    Then status 400
    And match response.error contains 'Invalid'

  Scenario: Upstream provider error (simulate)
    # This scenario is a placeholder for 502 error simulation
    * def upstreamError = true
    # You may need to mock or simulate this in your service
