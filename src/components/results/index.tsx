import * as React from 'react';

import gql from "graphql-tag";
import { Query } from 'react-apollo';



const GET_NEARBY_INFO = gql`
    query getInfo ($lat: Number, $lon: Number) {
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
    }
`;

interface InterfaceProps {
  lat: number;
  lon: number;
}


class TransitQuery extends Query<InterfaceProps> {}

const Results: React.SFC<InterfaceProps> = props => {
    console.log(props);
    return (
        <TransitQuery query={GET_NEARBY_INFO} variables={{lat: props.lat, lon: props.lon}}>
        {({ loading, error, data }) => {
            if (loading) {
                return 'Loading...';
            }
            if (error) {
                return `Error! ${error.message}`;
            }

            console.log(error);
            return (<div> Oh shit </div>);


        }}
        </TransitQuery>
    );
};

export default Results;
