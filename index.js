//Storijng dataset url in variables
const countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

const req = new XMLHttpRequest();
req.open('GET', countyUrl, true);
req.send();
req.onload = () =>{
        countyData = JSON.parse(req.responseText);
        //Convert to GeoJSON format
        newCountyData = topojson.feature(countyData, countyData.objects.counties).features;
        drawMap();
}

const req2  = new XMLHttpRequest();
req2.open('GET', educationUrl, true);
req2.send();
req2.onload = () =>{
    edData = JSON.parse(req2.responseText);
    console.log(edData)
}
let countyData;
let newCountyData;
let edData;

const svg = d3.select('svg');

const drawMap = () =>{

    const hoverTool = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('opacity', 0);

    svg.selectAll('path').data(newCountyData).enter().append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (d) =>{
            let id = d['id'];
            let county = edData.find((d) => {
                return d['fips'] === id
            })

            let percent = county['bachelorsOrHigher'];
            
            if(percent  <= 15){
                return 'lightgreen'
            }
            else if(percent <=30){
                return 'limegreen'
            }
            else if(percent <= 45){
                return 'green'
            }
            else{
                return 'darkgreen'
            }
        })
        .attr('data-fips', (d, event) => d['id'])
        .attr('data-education', (d) => {

            let id = d['id'];
            let county = edData.find((d) => {
                return d['fips'] === id
            })
            let percent = county['bachelorsOrHigher'];
            return percent;
        })
        .on('mouseover', (d, event) =>{
            hoverTool.style('opacity', 0.9);
            hoverTool.html(() =>{
                let display = edData.filter( (c) => c.fips === d.id);
            

            if(display[0]){
                return(
                    display[0]['area_name'] + ', ' + 
                    display[0]['state'] + ': ' +
                    display[0].bachelorsOrHigher + '%');
            }
            return 0;
        })
        .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px')
            .attr('data-education', () =>{
                let display = edData.filter( (c) => c.fips === d.id);
            
            if(display[0]){
                return display[0].bachelorsOrHigher
            }
            return 0;
        })
    })
        .on('mouseout', () =>{
            hoverTool.style('opacity', 0);
        })
}