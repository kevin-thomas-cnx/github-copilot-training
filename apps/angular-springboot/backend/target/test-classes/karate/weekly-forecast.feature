Feature: Weekly Forecast API

        Scenario: Get 7-day forecast (success)
            Given url 'http://localhost:8080/api/v1/forecast/week?latitude=42.36&longitude=-71.06'
              And header Accept = 'application/json'
             When method get
             Then status 200
              And match response.forecast == '#[7]'
                * def checkForecast =
                  """
                  function(arr) {
                    for (var i = 0; i < arr.length; i++) {
                      var x = arr[i];
                      if (!karate.match(x, { day: '#string', temperature: { min: '#number', max: '#number' }, precipitationChance: '#number' }).pass) return false;
                      if (!karate.match(x.temperature.min, '#number').pass) return false;
                      if (!karate.match(x.temperature.max, '#number').pass) return false;
                      if (!karate.match(x.precipitationChance, '#number').pass) return false;
                    }
                    return true;
                  }
                  """
                * if (karate.typeOf(response.forecast) == 'array') karate.call(checkForecast, response.forecast)

        Scenario: Missing latitude (error)
            Given url 'http://localhost:8080/api/v1/forecast/week?longitude=-71.06'
              And header Accept = 'application/json'
             When method get
             Then status 400
              And match response.error contains 'Missing'

        Scenario: Service unavailable (simulate)
    # This scenario is a placeholder for 503 error simulation
                * def unavailable = true
    # You may need to mock or simulate this in your service
