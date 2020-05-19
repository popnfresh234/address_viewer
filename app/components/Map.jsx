import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


class Map extends Component {
  constructor( props ) {
    super( props );
    this.CAP_HEIGHTS = { lat: 49.3584482, lng: -123.1068815 };
    this.CONTAINER_STYLE = {
      width: '100vw',
      height: '100vh',
    };
    this.state = {
      customers: [],
      markers: [],
    };
  }

  componentDidMount() {
    fetch( '/data/' )
      .then( result => result.json() )
      .then( ( markers ) => {
        this.setState( { markers } );
      } );
  }


  render() {
    return (
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={this.CONTAINER_STYLE}
          center={this.CAP_HEIGHTS}
          zoom={12}
          onLoad={this.onMapLoad}
        >
          {this.state.markers.map( marker => <Marker position={marker} key={marker.lng} /> )}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
