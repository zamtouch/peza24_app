import React, { useState, useRef } from "react";
import { Text, View, FlatList, Image, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import VideoApp from "./inc/VideoApp";
import { Feather, FontAwesome, FontAwesome5, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'
import SetNotify from "./setNotifications";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function ProfileHome(props) {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState([]);

  const navigation = useNavigation();

  const delete_account = () => {
    Alert.alert(
        "Are you sure",
        "We shall delete all your data & you will need to create an account again once your account is deleted.",
        [
            { text: "YES", onPress: () => Alert.alert("Your account will be deleted within 48hrs.") },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ]
      );
  }


  const save_user = async (value) => {
    try {
      const value2 = JSON.stringify(value)
      await AsyncStorage.setItem("user", value2);
  
    } catch (e) {
      // saving error
   
    }
  };

  const get_user_updates = (value) => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer "+value
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://cms.peza24.com/users/me", requestOptions)
      .then((response) => response.json())
      .then((response) => {
        if (response.hasOwnProperty("data")) {
          //save user_data
          console.log( "new user " + response.data )
          setUser( response.data );
          save_user( response.data );
   
        } else {
          console.log( "ERROR GETTING DATA " + response );
          if ( response.errors[0].message == "Invalid user credentials." || response.errors[0].message == "Token expired." ) {
            logout();
            
          }
         // alert(response.errors[0].message);
        }
      })
      .catch((err) => console.error(err));
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('access_token');
      const my_profile = await AsyncStorage.getItem('user');
      if ( value !== null ) {
        // value previously stored
            global.access_token = value;
            console.log( value );
            setToken( value );
            setUser( JSON.parse( my_profile ) );
            get_user_updates(value);

      }
    } catch(e) {
      // error reading value
    }
  }

  const play = ( video_id ) => {
    global.play_video = video_id;
    childRef.current.getAlert()
  } 

  const logout = async () => {
  
      try {
     
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user');
        props.setLogin( true );

      } catch (e) {
        // saving error
      }
    
  }

  const childRef = useRef(null);

  const account_type = ( value ) => {

    if ( value == "1" ) {
        setAc("Customer");
    }
      else if ( value == "2" ) {
        setAc("Freelancer/Consultant");
       } else if ( value == "3" ) {
        setAc("Freelancer/Consultant");
      }
  }

  React.useEffect(() => {

    get_user_updates( global.access_token );
    const unsubscribe = navigation.addListener('focus', () => {
      getToken();
      get_user_updates( global.access_token );
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  
  }, [navigation]);

  return (
<ScrollView style={{ flex:1, backgroundColor:'#fff' }}>
  <View style={{ alignItems:'center', padding:15 }}>


<TouchableOpacity onPress={() => delete_account() }  style={ styles.menu_item }><Text style={styles.menu_text}>Delete Account</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>

</View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  iconstyle1: {
    fontSize:16
  },
  iconstyle2: {
    fontSize:16,
    color:'#ddd'
  },
  menu_item:{
      color:'#777',
      backgroundColor:'#fff',
      padding:15,
      borderRadius:5,
      minWidth:'85%',
      flexDirection:'row',
      marginVertical:5,
      elevation:5,
      borderColor:'#ddd',
      borderWidth:1
    },
    menu_text: {
      flex:1,
      color:'#444'
    },
    iconButtons: {
      alignItems:'center',
      marginRight:15,
      width:100,
      borderColor:'#ddd',
      borderWidth:1,
      backgroundColor:'#fff',
      padding:15,
      borderRadius:5
    },
    icontext: {
      color:'#444',
      fontSize:11,
      marginTop:5
    },
  buttonsContainer: {
    padding: 10
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8
  }
});
