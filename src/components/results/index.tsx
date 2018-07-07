// Vendors
import * as React from 'react';

import gql from "graphql-tag";
import { Query } from 'react-apollo';

import mapboxgl from 'mapbox-gl';

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

    constructor(props:any) {
        super(props);

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
            const radius = 10000;
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
        };

    }

    /**
     * Get Map - rest to get that map
     * @param data 
     * @param coords 
     */

    public getMap(this:any, coords:any):any {

            const { lat, lon } = coords;
            const zoom = 18;

            this.map = new mapboxgl.Map({
                container: 'mapContainer',
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [lon, lat],
                zoom
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
                            this.formatData(data, {lat, lon});
                            this.getMap({lat, lon});
                            return (
                                <div>
                                    <div id="mapContainer" />
                                    <div className="grid-container">
                                        <div className="grid-item">
                                            he
                                        </div>
                                    </div>
                                </div>
                            )
                        };

                        return null;


                    }}
                </TransitQuery>
            </React.Fragment>

            
        );
    }
};
