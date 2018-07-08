import gql from "graphql-tag";

// Mono query
export const GET_NEARBY_INFO = gql`
    query getInfo ($lat: Float, $lon: Float) {
        stopsByRadius(lat:$lat, lon:$lon, radius:500) {
            edges {
                node {
                    stop {
                        name
                        lat
                        lon
                    }
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
