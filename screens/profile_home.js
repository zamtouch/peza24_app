import React, { useState, useRef } from "react";
import { Text, View, FlatList, Image, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import VideoApp from "./inc/VideoApp";
import { Feather, FontAwesome, FontAwesome5, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native'

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function ProfileHome(props) {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState([]);

  const navigation = useNavigation();


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
<VideoApp ref={childRef} />
{user.my_bio_video?
<ImageBackground source={{ uri: "https://img.youtube.com/vi/" + user.my_bio_video + "/hqdefault.jpg" }} resizeMode="cover"  style={{ height: global.width * 0.5, backgroundColor:'#222' }}>
  <View style={{ justifyContent:'center', alignItems:'center', flex:1, backgroundColor:'rgba(0,0,0,0.4)' }}>
    <TouchableOpacity onPress={() => play( user.my_bio_video )} >
    <Image source={require("../assets/play.png")} style={{ height:60 }} resizeMode="contain" />
  
</TouchableOpacity>
<Text style={{ color:'#fff', marginVertical:10 }}>My Introduction Video</Text>
</View>
    </ImageBackground>:
    <View style={{ justifyContent:'center', alignItems:'center', height: global.width * 0.40, backgroundColor:'#222' }}></View>
  }
  <View style={{ alignItems:'center', padding:15 }}>
    <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-profile-pic.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} >
    { user.profile_pic?
      <Image source={{ uri: "https://media.peza24.com/profile/" + user.profile_pic }} style={{ height:100, width: 100, borderRadius:100, borderColor:'#fff', backgroundColor:'#222', borderWidth:4, marginTop:-50 }} />:
      <Image source={require('../assets/user_placeholder.jpg')} style={{ height:100, width: 100, borderRadius:100, borderColor:'#fff', backgroundColor:'#222', borderWidth:4, marginTop:-50 }} />}
</TouchableOpacity>
  <View style={{ alignItems:'center', padding:10 }}>
  <Text>{ user.account_type == 3 ? user.company_name : user.first_name }</Text>
  <Text style={{ color:'#999' }}>{ user.title }</Text>
  <Text style={{ color:'#cc0000' }}></Text>
  </View>

  { user.account_type == 1 ?
    <View>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-profile.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="user" /> My Profile</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
   <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-orders-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="coins" /> My Orders (Services)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
       <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-orders-products.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="shopping-cart" /> My Orders (Products)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
    
      <TouchableOpacity style={ styles.menu_item }><Text style={styles.menu_text}><Feather style={styles.iconstyle1} name="settings" /> Account Settings</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
    </View> 
    : null
  }

  { user.account_type == 2 ?
    <View>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-profile.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="user" /> My Profile</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-education.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><Feather style={styles.iconstyle1} name="book-open" /> My Education</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
    <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-portfolio.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="images" /> My Portfolio</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
        <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-skills.php?a="+global.access_token),
                  navigation.navigate('ProfilePage')
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="star" /> Service Skills</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
     
             <Text style={{ marginVertical:10, color:'#999' }}>SERVICES</Text>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="coins" /> My Services (Virtual/Remote Work)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
        <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-orders-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="file" /> My Orders (Services)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
       
          <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/manage-orders-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="users" /> Customer Orders (Services)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
     
     </View> 
    : null
  }

{ user.account_type == 3 ?
    <View>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-profile.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><Entypo style={styles.iconstyle1} name="shop" /> Company Profile</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
          <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-portfolio.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="images" /> Portfolio</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
  
        <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-skills.php?a="+global.access_token),
                  navigation.navigate('ProfilePage')
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="star" /> Service Skills</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
      <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="coins" /> Services (Virtual/Remote Work)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
         <Text style={{ marginVertical:10, color:'#999' }}>SERVICES</Text>
        <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/my-orders-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="file" /> My Orders (Services)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
           <TouchableOpacity onPress={() => {
                (global.profile_url =
                  "https://app.peza24.com/mobile/manage-orders-services.php?a="+global.access_token),
                  navigation.navigate('ProfilePage');
              }} style={ styles.menu_item }><Text style={styles.menu_text}><FontAwesome5 style={styles.iconstyle1} name="users" /> Customer Orders (Services)</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>

     </View> 
    : null
  }

<TouchableOpacity style={ styles.menu_item }><Text style={styles.menu_text}><Feather style={styles.iconstyle1} name="settings" /> Account Settings</Text><FontAwesome5 style={styles.iconstyle2} name="chevron-right" /></TouchableOpacity>
  
<TouchableOpacity style={{ marginVertical:30 }} onPress={ () => logout() }><Text><FontAwesome5 style={styles.iconstyle1} name="lock" />  Logout</Text></TouchableOpacity>
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
