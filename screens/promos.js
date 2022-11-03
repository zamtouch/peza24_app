import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import moment from "moment";
import { Feather, FontAwesome, FontAwesome5, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import VideoApp from "./inc/VideoApp";
import CatalogueApp from "./inc/CatalogueApp";

export default function Home() {

    const [ greet, setGreet ] = useState(null);

    const [fv, setFv] = useState([
        {
          video_id: "start",
          title: "sss",
        },
        {
          video_id: "start",
          title: "sss",
        },
        {
          video_id: "start",
          title: "sss",
        }
      ]);
    
      const [rates, setRates] = useState({
        usd:0,
        rand:0
      });
    
      const [jobs, setJobs] = useState([
        {
          job_title: "",
          job_company: "",
        },
      ]);
    
      const [users, setUsers] = useState([
        {
          title: "",
          first_name: "",
        },
      ]);
    
      const [ promos, setPromos ] = useState([]);
      const [ loader, setLoader ] = useState(true);
      const [ site, setSite ] = useState({
        home_wallpaper:'google.com',
        network_banner:'google.com',
        awards_banner:'google.com'
      });
    
      const play = ( video_id ) => {
        global.play_video = video_id;
        childRef.current.getAlert()
      }  
      
      const playCatalogue = ( c ) => {
    
        global.catalogue = c
        childRef2.current.getAlert();
      }
    
    
      const get_data = () => {
        Promise.all([
          fetch("https://cms.peza24.com/items/site_defaults").then(
            (resp) => resp.json()
          ),
          fetch(
            "https://cms.peza24.com/items/sales_and_promos?filter[status]=published&limit=100&fields=*.*.*"
          ).then((resp) => resp.json()),
        ])
          .then(function (response) {
    
            setTimeout(function() {
              setLoader(false);
            }, 1000);
            
    
            var featured_videos = response[1].data;
    console.log( featured_videos );
            setFv(featured_videos);
    
            setSite(response[0].data);

            setPromos(response[1].data);
    
    
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      };

      React.useEffect(() => {

        var myDate = new Date();
        var hrs = myDate.getHours();

        var greet;

        if (hrs < 12)
            greet = 'Good Morning';
        else if (hrs >= 12 && hrs <= 17)
            greet = 'Good Afternoon';
        else if (hrs >= 17 && hrs <= 24)
            greet = 'Good Evening';

            setGreet(greet);
   
          get_data();
      
      }, []);

      const childRef = useRef(null);
      const childRef2 = useRef(null);

  return (
    <View style={{ flex: 1, backgroundColor:'#fff' }}>
          <CatalogueApp ref={childRef2} />
    
<View style={{ flexDirection:'row', marginTop:20 }}>
<Text style={{ flex:1, fontSize:20, fontWeight:'bold', marginLeft: 15 }}>Latest Sales & Promos<Text style={{ color:'#cc0000' }}>.</Text></Text>
<Text style={{ marginRight:15, fontSize:16, color:'#777' }}>{promos.length + " Listings"}</Text>
</View>

        <View style={{ flexDirection:'row', padding:15 }}>
    
        <FlatList
        data={promos}
        numColumns={2}
        renderItem={ ({item}) => (
            <TouchableOpacity onPress={() => playCatalogue( item )} key={item.id} style={{  flex:1, paddingRight:10, height: global.width * 0.85, alignItems:'center' }}>
       
        
              <ImageBackground imageStyle={{ borderRadius:5, borderColor:'#ddd', borderWidth:1 }} source={{ uri: "https://cms.peza24.com/assets/" + item.featured_image.id }} resizeMode="contain" style={{ alignItems:'center', justifyContent:'center', width:'100%', height: global.width * 0.6 }}>
   
              </ImageBackground>
           
         
               <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginTop: 10, fontWeight:'bold' }}>{(item.store).toUpperCase()}</Text>
               <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 10,  }}>{item.title}</Text>
               <Text style={{ color:'darkorange', fontSize:13 }}>Expires</Text>
               <Text>{moment(item.expiry_date).utcOffset('+03:00').format('dddd MMM Do')}</Text>
               </TouchableOpacity> 
  )}
        keyExtractor={item => item.id}
      />

       
</View>

    </View>
  );


}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ECF0F1'
    },
    iconstyle:{
        color:'#777'
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