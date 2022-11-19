import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Loader from "./inc/Loader";
import ProfileHome from "./profile_home";
import Login from "./login";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function Profile({navigation}) {

    const [ login_status, setLogin ] = useState(true);

    const getLoginStatus = async () => {
        try {
        
          const access_token = await AsyncStorage.getItem('access_token');
          if ( access_token !== null ) {
            // value previously stored

                global.access_token = access_token;
                setLogin( false );
              
          } else {
            console.log( "access token is null" );
            setLogin( true );
            setLoader( false );
          }
        } catch(e) {
          // error reading value
        }
      }
      
    
      
      React.useEffect(() => {
    
        const unsubscribe = navigation.addListener('focus', () => {
          getLoginStatus();
          // The screen is focused
          // Call any action
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      
      }, [navigation]);

      return (
<View style={{ flex:1 }}>
        { login_status ? <Login setLogin={setLogin} /> : <ProfileHome setLogin={setLogin} /> }
        </View>
      );
        

}
