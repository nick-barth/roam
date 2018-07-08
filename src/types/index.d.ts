
/**
 * Coordinates - lat lon
 */
export interface Coords {
  lat: number;
  lon: number;
}

/**
 * NearByPois, as filtered by radius
 */
export interface NearByPois {
    bikeRentals: object[],
    bikeParks: object[],
    stops: object[]
}

export interface SearchComponent {
	setMap(object:any): void,
	clearSelection(): void
}
