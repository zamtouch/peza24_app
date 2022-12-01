import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, ActivityIndicator } from 'react-native';


export default function App({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [pushTokenError, setPushTokenError] = useState(false);

  const save_push_token = (token) => {

    if ( token !== '' ) {
 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+global.access_token);
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "push_token": token,
          "access_token": global.access_token
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        console.log("my token "+token);
        fetch("https://app.peza24.com/api/save_push_token.php", requestOptions)
          .then(response => response.text())
          .then(result => {
        
              var response = JSON.parse( result );
              
              if( response.hasOwnProperty('data')){
            
                              console.log("Token update successful");
                              console.log(response.data);
                       
                                  } else {
                                    console.log( response );
                                  }
        
          })
          .catch(error => console.log('error', error));

} else { 

    alert("Please enable push notifications in order to enjoy instant alerts on activities on Peza24.");

}
  }
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
        if (token) {
          console.log( "this is my token " + token );
        //  setExpoPushToken(token);
         save_push_token(token);
          
        } else {
            alert("Please enable push notifications in order to enjoy instant alerts on activities on Peza24.");
        }
    });
 
  }, []);


}

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }