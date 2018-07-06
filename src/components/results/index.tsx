// Vendors
import * as React from 'react';

import gql from "graphql-tag";
import { Query } from 'react-apollo';

// Components
import Spinner from '../spinner';


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

/**
 * Formatting floating point to numbers for lazy compares
 * @param float 
 */

function convertToInt(float: any):any {
    const s = String(float);
    const removedPoint = s.replace(/\./g,'');
    return Number(removedPoint);
}

/**
 * Calculate Stops/parks/bikerentals within proximity of our position
 * @param data 
 */

function calcWithinProximity (data:object[], coords:any) {

    const coordsLat = convertToInt(coords.lat);
    const coordsLon = convertToInt(coords.lon);

    const nearBy = data.filter((item:any) => {
        // Approximation of proximity
        const radius = 1000;
        const lat = convertToInt(item.lat);
        const lon = convertToInt(item.lon);

        return (lat - radius < coordsLat && coordsLat < lat + radius) && (lon - radius < coordsLon && coordsLon < lon + radius);
    });

    return nearBy;

}

/**
 * formatData
 * @param data 
 * @param coords 
 */

function formatData(data:any, coords:any):object {

    return {
        bikeParks: calcWithinProximity(data.bikeParks, coords),
        bikeRentals: calcWithinProximity(data.bikeRentalStations, coords)
    }

}

class TransitQuery extends Query<InterfaceProps> {}

const Results: React.SFC<any> = props => {
    const { lat, lon } = props;
    return (
        <TransitQuery query={GET_NEARBY_INFO} variables={{lat, lon}}>
        {({ loading, error, data }) => {
            if (loading) {
                return <Spinner />;
            }
            if (error) {
                return `Error! ${error.message}`;
            }
            if (data) {
                const formattedData = formatData(data, {lat, lon});
                console.log(formattedData);
                return <div> wow </div>;
            };

            return null;


        }}
        </TransitQuery>
    );
};

export default Results;
