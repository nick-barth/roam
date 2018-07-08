// Vendors
import * as React from 'react';

// Components
import Results from './components/results';
import Search from './components/search';

export  class App extends React.Component<any, any> {

	constructor(props: any) {
		super(props);

		this.state = {
			query: {
				location: ['',''],
				name: ''
			},
			isMapDisplayed: false
		};
	}

	/**
	 * Sets map to the point data we were given from the query
	 * @param pointData
	 */

	public setMap(pointData: any):void {
		this.setState({ query: pointData, isMapDisplayed:true });
	};

	/**
	 * Sets map to the point data we were given from the query
	 * @param pointData
	 */
	public clearSelection():void {
		this.setState({query: {location: ['',''], name:''}, isMapDisplayed: false})
	}

	public render() {
		const { query, isMapDisplayed } = this.state;

		return (
			<div className="App">
				<div className="title">
					Helsinki Public Transit
				</div>
				<Search setMap={(data:any) => this.setMap(data)} clearSelection={() => this.clearSelection()}/>
				<div className={`map-container ${isMapDisplayed ? 'map-container--displayed' : null}`}>
					<div id="mapContainer" />
				</div>
				{query.name !== '' ? <Results lat={query.location[1]} lon={query.location[0]} /> : null}
			</div>
		);
	}
}

export default App;
