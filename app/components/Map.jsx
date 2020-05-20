import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import latlngArr from '../../data/lat-lng-arr.json';

class Map extends Component {
  constructor( props ) {
    super( props );
    this.onMarkerClick = this.onMarkerClick.bind( this );
    this.onCloseClick = this.onCloseClick.bind( this );
    this.CAP_HEIGHTS = { lat: 49.3584482, lng: -123.1068815 };
    this.CONTAINER_STYLE = {
      width: '100vw',
      height: '100vh',
    };
    this.state = {
      markers: latlngArr,
      showInfo: false,
      marker: {},
    };
  }


  onMarkerClick( marker ) {
    this.setState( {
      showInfo: true,
      marker,
    } );
  }

  onCloseClick() {
    this.setState( {
      showInfo: false,
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
          {this.state.markers.map( marker =>
            ( <Marker
              position={marker.latlng}
              key={Math.random()}
              onClick={e => this.onMarkerClick( marker, e )}
            /> ) )}

          {this.state.showInfo &&
          <InfoWindow
            position={this.state.marker.latlng}
            onCloseClick={this.onCloseClick}
          >
            <h1>{this.state.marker.name}</h1>
          </InfoWindow>}
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
