import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import Loader from "./inc/Loader";
import ProfileHome from "./profile_home";
import Login from "./login";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function Profile() {

    const [ login_status, setLogin ] = useState(false);

    const getLoginStatus = async () => {
        try {
          const value = await AsyncStorage.getItem('login_status');
          const access_token = await AsyncStorage.getItem('access_token');
          if ( value !== null ) {
            // value previously stored
              if ( value !== '1' ) {
                setLogin( true );
                setLoader( false );
              } else {
                global.access_token = access_token;
              }

          } else {
            setLogin( true );
            setLoader( false );
          }
        } catch(e) {
          // error reading value
        }
      }
      
    
      
      React.useEffect(() => {
    
        getLoginStatus();
      
      }, []);

      return (
<View style={{ flex:1 }}>
        { login_status ? <Login setLogin={setLogin} /> : <ProfileHome setLogin={setLogin} /> }
        </View>
      );
        

}
