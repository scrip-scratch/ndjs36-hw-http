const http = require("http");
const url = require("url");
const API_KEY = process.env.API_KEY;
const BASE_API_URL = process.env.BASE_API_URL;

const PORT = process.env.PORT || 3000;

const getFormParamsRequest = () => `
  <form 
    method="GET"
    action="/weather"
    class="d-flex align-items-center g-2 justify-content-center fs-4"
  >  
  <input
    name="city"
    type="string"
    class="me-2 px-2 flex-grow-1"
    placeholder="e.g. Moscow"
    required    
  />
    <button
      class="btn btn-sm btn-success fs-4 px-3"
      type="submit"
    >
      GET
    </button>
  </form>
`;

const getWeatherTable = (weatherData) => `
    <div>
				<div class="d-flex align-items-center">
					<h3>Weather in ${weatherData.location.name}</h3>
					<img src="${weatherData.current.condition.icon}" /></td>
				</div>
        <table class="table">
					<tbody>
						<tr>					
							<td>Date</td>
							<td>${weatherData.current.last_updated}</td>					
						</tr>				
						<tr>					
							<td>Temprature</td>
							<td>${weatherData.current.temp_c} °C</td>					
						</tr>				
						<tr>					
							<td>Wind</td>
							<td>${Math.floor(weatherData.current.wind_kph / 3.6)} m/s</td>					
						</tr>				
						<tr>					
							<td>Description</td>
							<td>${weatherData.current.condition.text}
								
						</tr>				
					</tbody>
				</table>     
    </div> 

		
`;

const layoutStart = `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" 
crossorigin="anonymous">
    <div class="container pt-5">
			<h2 class="mb-4">GET WEATHER</h2>
				${getFormParamsRequest()}
`;

const layoutEnd = `</div>`;

const server = http.createServer(async (req, res) => {
  const urlParsed = url.parse(req.url, true);
  const { pathname, query } = urlParsed;
  const { method } = req;

  res.setHeader("Content-type", "text/html; charset=utf8;");

  if ((pathname === "/" || pathname === "/index") && method === "GET") {
    res.write(layoutStart);
    res.write(layoutEnd);
  }

  if (pathname === "/weather" && method === "GET") {
    const city = query.city;
    const requestUrl = `${BASE_API_URL}/current.json?key=${API_KEY}&q=${city}`;
    const weatherResponse = await fetch(requestUrl);
    const weatherResponseData = await weatherResponse.json();

    if (weatherResponseData.error) {
      res.write(layoutStart);
      res.write(
        `<h4 class="text-center mt-5">${weatherResponseData.error.message}</h4>`
      );
      res.write(layoutEnd);
    } else {
      res.write(layoutStart);
      res.write(getWeatherTable(weatherResponseData));
      res.write(layoutEnd);
    }
  }

  res.end();
});

server.listen(PORT, () => console.log(`server is started on port ${PORT}`));
