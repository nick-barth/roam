// Vendors
import * as React from 'react';

import gql from "graphql-tag";
import { Query } from 'react-apollo';

import mapboxgl from 'mapbox-gl'

// Components
import Spinner from '../spinner';

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlzb3duZm9vdCIsImEiOiJjamphNWZvaTMwN3VkM3dwajluOGQxOThtIn0.96xLYTzSYN7V6iN0EbzpnA';


// Interfaces
interface InterfaceProps {
  lat?: number;
  lon?: number;
}



// GQL query
const GET_NEARBY_INFO = gql`
    query getInfo ($lat: Float, $lon: Float) {
        stopsByRadius(lat:$lat, lon:$lon, radius:500) {
            edges {
                node {
                    stop { 
                        gtfsId 
                        name
                    }
                    distance
                }
            }
        }
        bikeRentalStations{
            name
            stationId
            id
            lat
            lon
        }
        bikeParks{
            name
            id
            lat
            lon
        }
    }
`;

class TransitQuery extends Query<InterfaceProps> {}

export default class Results extends React.Component<any, any> {
    private mapContainer: React.RefObject<any>;

    constructor(props:any) {
        super(props);

        this.mapContainer = React.createRef();

    }


    /**
     * Formatting floating point to numbers for lazy compares
     * @param float 
     */

    public convertToInt(float: any):any {
        const s = String(float);
        const removedPoint = s.replace(/\./g,'');
        return Number(removedPoint);
    }

    /**
     * Calculate Stops/parks/bikerentals within proximity of our position
     * @param data 
     */

    public calcWithinProximity (data:object[], coords:any) {

        const coordsLat = this.convertToInt(coords.lat);
        const coordsLon = this.convertToInt(coords.lon);

        const nearBy = data.filter((item:any) => {
            // Approximation of proximity
            const radius = 1000;
            const lat = this.convertToInt(item.lat);
            const lon = this.convertToInt(item.lon);

            return (lat - radius < coordsLat && coordsLat < lat + radius) && (lon - radius < coordsLon && coordsLon < lon + radius);
        });

        return nearBy;

    }

    /**
     * formatData
     * @param data 
     * @param coords 
     */

    public formatData(data:any, coords:any):object {

        return {
            bikeParks: this.calcWithinProximity(data.bikeParks, coords),
            bikeRentals: this.calcWithinProximity(data.bikeRentalStations, coords)
        }

    }

    /**
     * Get Map - rest to get that map
     * @param data 
     * @param coords 
     */

    public getMap(this:any, coords:any):any {

            const { lat, lon } = coords;
            const zoom = 16;

            // Straight up theivery https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
            const y = Math.floor((lon+180)/360*Math.pow(2,zoom));
            const x = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));

            // const backgroundUrl = `https://cdn.digitransit.fi/map/v1/hsl-map/${zoom}/${y}/${x}.png`;
            
            const poiUrl = `https://cdn.digitransit.fi/map/v1/hsl-stop-map/${zoom}/${y}/${x}.pbf`;

            const map = new mapboxgl.Map({
                container: 'mapContainer'
            });

            const data = {
                name:"Points of Interest",
                format:"pbf",
                maxzoom:20,
                minzoom:0,
                vector_layers:[
                    {
                        description:"",
                        id:"stops"
                    },
                    {
                        description:"",
                        id:"stations"
                    }]
                    ,
                center:[-122.444,37.7908,12],
                bounds:[-180,-85.0511,180,85.0511],
                tiles:[poiUrl],
                tilejson:"2.0.0"
            };

            map.on('load', () => {
                this.map.addSource('pois', {
                type: 'geojson',
                data
            });
        
        });

    }

    public render () {
        const { lat, lon } = this.props;
        return (
            <React.Fragment>
                <TransitQuery query={GET_NEARBY_INFO} variables={{lat, lon}}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <Spinner />;
                    }
                    if (error) {
                        return `Error! ${error.message}`;
                    }
                    if (data) {
                        const formattedData = this.formatData(data, {lat, lon});
                        console.log(formattedData);

                        this.getMap({lat, lon});
                    };

                    return null;


                }}
                </TransitQuery>
                <div id="mapContainer" ref={this.mapContainer} />
            </React.Fragment>

            
        );
    }
};
