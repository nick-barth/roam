// Vendors
import * as React from 'react';
import { Query } from 'react-apollo';
import mapboxgl from 'mapbox-gl';

// Components
import Spinner from '../spinner';

// Types
import { Coords, NearByPois } from '../../types';

// CSS
import './index.css';

// Queries
import { GET_NEARBY_INFO } from '../../queries';

// Would go in config file
mapboxgl.accessToken = 'pk.eyJ1IjoiaGlzb3duZm9vdCIsImEiOiJjamphNWZvaTMwN3VkM3dwajluOGQxOThtIn0.96xLYTzSYN7V6iN0EbzpnA';


// I can't decide how to pattern this so I'm going to be in paralysis and just leave it here.
class TransitQuery extends Query<Coords> {}

export default class Results extends React.Component<Coords, any> {

    constructor(props:Coords) {
        super(props);

    }

    /**
     * Formatting floating point to numbers for lazy compares
     * @param float
     */

    public convertToInt(float: number):number {
        const s = String(float);
        const removedPoint = s.replace(/\./g,'');
        return Number(removedPoint);
    }

    /**
     * Calculate Stops/parks/bikerentals within proximity of our position
     * @param data
     */
    public calcWithinProximity (data:object[], coords:Coords):object[] {

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

    public formatData(data:any, coords:Coords):NearByPois {

        const stops = data.stopsByRadius.edges.map((stop:any) => {
            return stop.node.stop;
        });

		// Sketchy stuff to get rid of duplicates (not really duplicates, but whatever)
        const uniqStops = stops.filter((stop:any, index:number, self:any) =>
            index === self.findIndex((s:any) => (
                s.name === stop.name
            ))
        );


        return {
            bikeParks: this.calcWithinProximity(data.bikeParks, coords),
            bikeRentals: this.calcWithinProximity(data.bikeRentalStations, coords),
            stops: uniqStops
        };

    }

    /**
     * Centers map to passed location, doesnt allow chaining to make beuatiful transition :(
     * @param this
     * @param coords
     */

    public centerMap(this: any, coords:Coords):void {
		const { lat, lon } = coords;

		this.map.easeTo({
			center: [lon, lat],
		})

	}

    /**
     * Creates new map
     * @param this
     * @param coords
     */
    public getMap(this:any, coords:Coords):void {
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
        this.getMap({lat, lon});

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
                            const pois = this.formatData(data, {lat, lon});
                            return (
                                <div>
                                    <div className="results__grid-container">
                                        <div className="results__grid-item">
                                            <div className="results__grid-item__title">
                                                Bike Rentals Stations
                                            </div>
                                            <div className="results__grid-item__list">
                                                {pois.bikeRentals[0] ? (
                                                    pois.bikeRentals.map((station:any) => {
                                                        return (
                                                            <div
                                                                className="results__grid-item__list-item"
                                                                onClick={() => this.centerMap({lat:station.lat, lon:station.lon})}
                                                                key={station.name}
                                                            >
                                                                {station.name}
                                                            </div>
                                                        )
                                                })) : <span> Nope :( </span>}
                                            </div>
                                        </div>
                                        <div className="results__grid-item">
                                            <div className="results__grid-item__title">
                                                Transit Stops
                                            </div>
                                            <div className="results__grid-item__list">
                                                {pois.stops[0] ? (
                                                    pois.stops.map((station:any) => {
                                                        return (
                                                            <div className="results__grid-item__list-item"
                                                            onClick={() => this.centerMap({lat:station.lat, lon:station.lon})}
                                                            key={station.lat}
                                                        >
                                                                {station.name}
                                                            </div>
                                                        )
                                                    })
                                                ) : <span> Nothing close.. sorry :( </span>}
                                            </div>
                                        </div>
                                        <div className="results__grid-item">
                                            <div className="results__grid-item__title">
                                                Bike Parking
                                            </div>
                                            <div className="results__grid-item__list">
                                                {pois.bikeParks[0] ? (
                                                    pois.bikeParks.map((station:any) => {
                                                        return (
                                                            <div className="results__grid-item__list-item"
                                                            onClick={() => this.centerMap({lat:station.lat, lon:station.lon})}
                                                            key={station.lat}
                                                        >
                                                                {station.name}
                                                            </div>
                                                        )
                                                    })
                                                ) : <span> Nope, chain ur bike to a tree </span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        };
                        return null;
                    }}
                </TransitQuery>
        );
    }
};
