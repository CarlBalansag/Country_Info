const search_input = document.getElementById('input')
const form = document.getElementById('form')
const url = 'https://countries-cities.p.rapidapi.com/location/country/list';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '0aecbba164msh7f920f485034affp13bb34jsn2de9f4ab946f',
		'X-RapidAPI-Host': 'countries-cities.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	var result = await response.json();
} catch (error) {
	console.error(error);
}

var turned_on = false;

async function main(e){

	e.preventDefault();
	function getKeyByValue(object, value) {
		return Object.keys(object).find(key => object[key] === value)};

	const valueExists = (obj, value) => Object.keys(obj).some((key) => obj[key] === value);
    const input = search_input.value;

	if (input === '') {
		alert('Please enter a country')
}

	function startsWithCapital(word){
		return word.charAt(0) === word.charAt(0).toUpperCase()
	}

	if (valueExists(result.countries, input)) {
		console.log("Value exists");

	} else {
		alert('Invalid Country')
		console.log("Value does not exist");
	}

	turned_on = true;

	let country_code =  getKeyByValue(result.countries,input)

	console.log(country_code)


	const url = `https://countries-cities.p.rapidapi.com/location/country/${country_code}`;
	
	try {
		const response_country = await fetch(url, options);
		var country = await response_country.json();
		console.log(country);
		console.log(country.name)
	} catch (error) {
		console.error(error);
	}



	//Display Functions

	const container = document.querySelector('.container');
	const information = document.querySelector('.information');
	const country_info = document.querySelector('.country_info');

	const url_rating = `https://www.travel-advisory.info/api?countrycode=${country_code}`;

	try {
		const response_country = await fetch(url_rating);
		var rating = await response_country.json();
		console.log(rating);
	} catch (error) {
		console.error(error);
	}

	function display_info(){

		country_info.innerHTML =	
		`
			<p class="country">${country.name}</p>
			<img src="${country.flag.file}"></img>
			<p class="p_tag">Population: ${country.population}</p>
			<p class="p_tag">Land size: ${country.area_size}</p>
			<p class="p_tag">Currency: ${country.currency.name}</p>
			<div class=rating>
				<p class="rating">${rating.data[`${country_code}`].advisory.message}
				<button><a id="link" href="" target="_blank">More Info</a></button
			</div>
		`
	}

	function change_css(){
		const country_url = 'https://www.travel-advisory.info/' + country.name.toLowerCase();
		const information_class = document.querySelector('.country_info');
		const bg = document.querySelector('.bg');
		const a = document.querySelector('#link');
		const bg2 = document.querySelector('.bg2');
		const bg3 = document.querySelector('.bg3');
		const content = document.querySelector('.content');
		const container = document.querySelector('.container');

		let http = new XMLHttpRequest();
		http.open('get', 'country-colors.json', true);
		http.send();
		http.onload = function(){
			if(this.readyState == 4 && this.status == 200) {
				var colors = JSON.parse(this.responseText);
				console.log("Launched colors.json")
				function find_color_array(task) {
					return task.name ===input;
				}
			
				var task = colors.find(find_color_array);

				if (turned_on) {

					a.getAttribute("href");
					a.setAttribute("href", country_url)
					container.style.cssText = 
					`background-color:rgba(4,13,33,.9);`;
					bg.style.cssText = 
					`
					animation:slide 3s ease-in-out infinite alternate;
					background-image: linear-gradient(-60deg, ${task.colors[0]} 50%, ${task.colors[1]} 50%);
					bottom:0;
					left:-50%;
					opacity:.5;
					position:fixed;
					right:-50%;
					top:0;
					z-index:-1;
					`;
					bg2.style.cssText = 
					`
					animation-direction:alternate-reverse;
					animation-duration:4s;
					`;
					bg3.style.cssText = 
					`
					animation-duration:5s;
					`;
					console.log('background changed');
				} else {
					console.log('did not change color');
				}

			} else {
				console.log("failed to launch colors.json")
			}
			return task
		}

	}

	display_info();
	change_css();

}



function init(){
	form.addEventListener('submit', main);
}

init()

