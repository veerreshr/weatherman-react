import React, {Component, Fragment, useEffect, useState, useRef, useContext} from 'react';
import moment from 'moment-timezone';
import {isValid} from '../../utils/validityHelper';
import {convertToFahrenheit} from '../../utils/temperatureHelper';
import getWeatherIcon from '../../utils/getWeatherIcon';
import {UnitContext} from '../../context/unit/Unit';
import {WeatherIcon, WeatherDirectionIcon} from './WeatherIcon';
import assetsSrc from '../../utils/assetsSrc';

function CurrentInfoDetail({currentWeather}) {
  const {weatherUnit, setWeatherUnit} = useContext(UnitContext);
  const avgTemp = (currentWeather.temp.min + currentWeather.temp.max)/2;

  const unitClick = (unit) => {
       setWeatherUnit(unit);
  }

  const convertToMetric = (mph) => {
      //  meters per second
      return 0.45 * mph;
  }


// currentWeather will be just the weather forecast item for one day
  return (
      (isValid(currentWeather)) ?
      <Fragment>
        <div className="detail-container d-flex flex-row p-2 justify-content-center align-items-center">
          <div className="d-flex flex-column align-items-center">
              <img src={`${assetsSrc}/${getWeatherIcon(currentWeather.weather.icon)}`} alt={currentWeather.weather.description} className="img-fluid w-75 h-75 p-2" />
              <p className="my-2 text-center text-capitalize font-medium">{currentWeather.weather.description || ''}</p>
          </div>
          <div>
          <p>
          <span className="h3">{Math.round(weatherUnit === "C" ? avgTemp : convertToFahrenheit(avgTemp))}</span> <WeatherIcon iconName="degrees"/>
          <span className="font-weight-light" style={{fontSize: '1.5rem'}}>
            <span className={`cursor-pointer ${weatherUnit === "C" ? "font-weight-normal border-light" : "opacity-75"}`} onClick={() => unitClick("C")}>C</span>  &nbsp;|&nbsp;
            <span className={`cursor-pointer ${weatherUnit === "F" ? "font-weight-normal border-light" : "opacity-75"}`} onClick={() => unitClick("F")}>F</span>
          </span>
          </p>
          <p>
          <span className="font-weight-normal">{moment(currentWeather.dt,"YYYY-MM-DD").format('MMM Do') || ''}</span>
          </p>

          </div>
        </div>
        <div className="detail-container d-flex flex-column justify-content-center align-items-center p-2" >
          <div className="ml-sm-3 ml-md-3 ml-lg-3">
          {currentWeather.pressure ? (<div className="my-1"><p className="mb-2"><span className="font-weight-bold">Air pressure:</span> {currentWeather.pressure || ''} mbar</p></div>) : null}
          {currentWeather.humidity ? (<div className="my-1"><p className="mb-2"><span className="font-weight-bold">Humidity:</span> {currentWeather.humidity || ''} %</p></div>) : null}
          {currentWeather.wind_speed ? (<div className="my-1"><p className="mb-2"><span className="font-weight-bold">Wind speed:</span> {(weatherUnit === "C" ? convertToMetric(currentWeather.wind_speed).toFixed(2) + ' mps'
                    : currentWeather.wind_speed.toFixed(2) + ' mph')}
                  &nbsp;<WeatherDirectionIcon iconName={currentWeather.wind_deg}/> </p></div>) : null }
          </div>
        </div>
      </Fragment> : null
  );

}




export default CurrentInfoDetail;
