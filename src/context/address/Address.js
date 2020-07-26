// eslint-disable-next-line
import React, {
  Component
} from 'react';
import parseCoordinates from '../../utils/CoordinateHelper';
import fetchIPLocation from '../../utils/fetchIPLocation';
import {isValid} from '../../utils/validityHelper';
import API_URL from '../../utils/API';
const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

const AddressContext = React.createContext(null);

class AddressContextProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: {},
      latLng: {},
      cityName: '',
      updateState: this.updateState
    };

  }

  updateAddress = (latLng) => {
    //  geocoding api to get address closest to lat & long
    const response = fetch(`${API_URL}weather?lat=${latLng.lat}&lon=${latLng.lng}&units=metric&appid=${WEATHER_API_KEY}`, {
        mode: "cors"
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then((res) => {
        // set Address
        if (res.id) {
          this.updateState({
            address: Object.assign({}, {id: res.id, name: res.name, coord: res.coord}),
            cityName: res.name,
            latLng: res.coord
          });

        }
        console.log(res);
      })
      .catch((error) => {
        console.error('There is a problem with your fetch: ', error);
      });

  }

  updateIPAddress = async () => {
    var response = await fetchIPLocation();
    if (isValid(response)) {
      var latLng = {
        lat: response.latitude,
        lng: response.longitude
      };
      this.updateAddress(latLng);
    }
  }

  getCurrentCoordinates = () => {
    // use HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var latLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.updateAddress(latLng);
        console.log(latLng);

      }, (error) => {
        //handle error here
        console.error(error);
        this.updateIPAddress();
      });
    }
    else {
      this.updateIPAddress();

    }


  }

  updateState = (state) => {
    this.setState({
      ...state
    });
  }

  componentDidMount() {
    this.getCurrentCoordinates();
  }


  render() {
    return (
      <AddressContext.Provider value={this.state}>
         {this.props.children}
      </AddressContext.Provider>
    )
  }
}


export {
  AddressContextProvider,
  AddressContext
};