import { StyleSheet, Text, StatusBar, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { TextInput } from 'react-native';
import { Button } from 'react-native';

export default function App() {

  const [location, setLocation] = useState(null);
  const [coords, setCoords] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to get location')
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log("Latitude is " + location.coords.latitude);
        console.log("Longitude is " + location.coords.longitude);
      })();
  }, []);

  const getAddress = () => {
    console.log("Searching with the keyword " + keyword + "...");
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=tHALcNsWXHEwQT9rb7E2l0reysEF61as&location=${keyword}`)
    .then(response => response.json())
    .then(data => setCoords(data.results[0].locations[0].displayLatLng))
    .catch(error => {
      alert('Error', error);
    });
  }

  useEffect(() => {
    console.log(coords.lat)
    console.log(coords.lng)
  }, [coords]);
  


  return (
    <View style={styles.map}>
      {location !== null && coords.length == 0 &&
        <MapView 
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          }}
          region={{
            latitude: coords.lat,
            longitude: coords.lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          }}
          >
          <Marker
            coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude}}
            title='Your location'/>
        </MapView>
      }
      {coords.length !== 0 &&
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: coords.lat,
            longitude: coords.lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          }}
        >
        <Marker 
          coordinate={{
          latitude: coords.lat,
          longitude: coords.lng}}
          title={keyword}/>
        </MapView>
      }
      <TextInput
        style={{borderWidth: 1, padding: 2}}
        placeholder='Search a location'
        onChangeText={text => setKeyword(text)}
      />
      <Button title='Show' onPress={getAddress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});
