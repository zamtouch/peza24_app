import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import moment from "moment";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import VideoApp from "./inc/VideoApp";
import CalculatorApp from "./inc/CalculatorApp";
import CatalogueApp from "./inc/CatalogueApp";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation}) {

    const [ greet, setGreet ] = useState(null);
    const [ video1, setVideo1 ] = useState(null);

    const images = [
      {
        url:
          'https://raw.githubusercontent.com/AboutReact/sampleresource/master/sample_img.png',
      },
      {
        url:
          'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
      },
    ];
  

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
        awards_banner:'google.com',
      });
    
      const play = ( video_id ) => {
        global.play_video = video_id;
        setVideo1( video_id );
        childRef.current.getAlert(video_id)
      }  
      
      const playCatalogue = ( c ) => {
    
        global.catalogue = c
        childRef2.current.getAlert();
      }

      const calc = ( c, c2 ) => {
    
        global.rate = c;
        global.currency = c2;
        childRef3.current.getAlert();
      }
    
    
      const get_data = () => {
        Promise.all([
          fetch("https://cms.peza24.com/items/site_defaults").then(
            (resp) => resp.json()
          ),
          fetch(
            "https://cms.peza24.com/items/job_listings?limit=5&fields=*.*.*&sort=-date_created"
          ).then((resp) => resp.json()),
          fetch(
            "https://cms.peza24.com/items/fx_rates/1"
          ).then((resp) => resp.json()),
          fetch(
            "https://cms.peza24.com/items/sales_and_promos?&sort=-date_created&filter[status]=published&limit=4&fields=*.*.*&filter[expiry_date][_gte]=$NOW"
          ).then((resp) => resp.json()),
        ])
          .then(function (response) {
    
            setTimeout(function() {
              setLoader(false);
            }, 1000);
            
    
            var featured_videos = response[1].data;

            setFv(featured_videos);
    
            setSite(response[0].data);
    
            setJobs(response[1].data);
            setRates(response[2].data);
            setPromos(response[3].data);
    
    
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      };

      const get_dif = (date) => {
        var a = moment( date );
        var b = moment();
        return a.diff( b, 'days' );
      }

      const getToken = async () => {
        try {
          const value = await AsyncStorage.getItem('access_token');
          const my_profile = await AsyncStorage.getItem('user');
          if ( value !== null ) {
            // value previously stored
                global.access_token = value;
    
          }
        } catch(e) {
          // error reading value
        }
      }

      React.useEffect(() => {
        
        getToken();
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
      const childRef3 = useRef(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor:'#fff' }}>

          <VideoApp video1={video1} ref={childRef} />
          <CatalogueApp ref={childRef2} />
          <CalculatorApp ref={childRef3} />
        <View style={{ flexDirection:'row', padding:15 }}>
        <View style={{ flex:1 }}>
        
            <View style={{ }}>
     
            <Text style={{ fontSize:24, fontWeight:'bold' }}>{greet}<Text style={{ color:'#cc0000' }}>.</Text></Text>
            <Text style={{ color:'#999' }}>{moment().utcOffset('+03:00').format('dddd MMM Do YYYY')}</Text>
            </View>
         
            </View>

            <View>
        
              <View style={{ flexDirection:'row', }}>

                <View style={{ borderRadius:5, padding:5, margin:5 }}>

               
                <TouchableOpacity onPress={ () => calc( rates.usd.toFixed(2), 'USD' ) }>
                <Text style={{ fontWeight:'bold', fontSize:11 }}><Ionicons style={styles.iconstyle} size={14} name="calculator" /> USD</Text>
                <Text>K{rates.usd.toFixed(2)}</Text>
                </TouchableOpacity>
                </View>
                
                <View style={{ borderRadius:5, padding:5, margin:5 }}>


     
                <TouchableOpacity onPress={ () => calc( rates.rand.toFixed(2), 'RAND' ) }>
                <Text style={{ fontWeight:'bold', fontSize:11 }}><Ionicons style={styles.iconstyle} size={14} name="calculator" /> ZAR</Text>
                <Text>K{rates.rand.toFixed(2)}</Text>
                </TouchableOpacity>
</View>
</View>
                </View>
        </View>

        <View>
        
        


      <View style={{ flexDirection:'row', margin:15, marginBottom:15 }}>

      <TouchableOpacity style={{ flex:1, alignItems:'center' }} onPress={ () => { navigation.navigate( 'Podcasts' ) } }>
       
            <Ionicons style={styles.iconstyle} size={24} name="videocam-outline" />
         
            <Text style={styles.icontext}>Podcasts</Text>
        </TouchableOpacity>

      <TouchableOpacity style={{ flex:1, alignItems:'center' }}  onPress={ () => { navigation.navigate( 'Projects' ) } }>
      
            <Ionicons style={styles.iconstyle} size={24} name="images" />
           
            <Text style={styles.icontext}>Projects</Text>
        </TouchableOpacity>

        
        <TouchableOpacity style={{ flex:1, alignItems:'center' }}  onPress={ () => { navigation.navigate( 'Services' ) } }>
    
            <Ionicons style={styles.iconstyle} size={24} name="cart" />
          
            <Text style={styles.icontext}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex:1, alignItems:'center' }}  onPress={ () => { alert("Coming soon") } }>
    
            <Ionicons style={styles.iconstyle} size={24} name="people" />
          
            <Text style={styles.icontext}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex:1, alignItems:'center' }}  onPress={ () => { alert("Coming soon") } }>
    
    <Ionicons style={styles.iconstyle} size={24} name="play" />
  
    <Text style={styles.icontext}>Music</Text>
</TouchableOpacity>


      </View>
    
<View style={{ flexDirection:'row', marginTop:30 }}>
<Text style={{ flex:1, fontSize:20, fontWeight:'bold', marginLeft: 15, marginBottom:15 }}>Latest Sales & Promos<Text style={{ color:'#cc0000' }}>.</Text></Text>
<TouchableOpacity onPress={ () => { navigation.navigate( 'Promos' ) } }><Text style={{ marginRight:15, fontSize:20, color:'#777' }}>See all</Text></TouchableOpacity>
</View>

        <View style={{ flexDirection:'row', paddingLeft:15, marginBottom:15 }}>
    
        <FlatList
        horizontal={true}
        data={promos}
        renderItem={ ({item}) => (
            <TouchableOpacity onPress={() => playCatalogue( item )} key={item.id} style={{  width: global.width * 0.50, paddingRight:10, height: global.width }}>
       
        
              <ImageBackground imageStyle={{ borderRadius:5, borderColor:'#ddd', borderWidth:1 }} source={{ uri: "https://cms.peza24.com/assets/" + item.featured_image.id }} resizeMode="cover" style={{ alignItems:'center', justifyContent:'center', width:'100%', height: global.width * 0.70 }}>
   
              </ImageBackground>
           
         
               <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginTop: 10, fontWeight:'bold' }}>{(item.store).toUpperCase()}</Text>
               <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 10,  }}>{item.title}</Text>
               {get_dif( item.expiry_date ) < 3 ?
               <Text style={{ color: 'red', fontSize:13 }}>Expires in { get_dif( item.expiry_date ) } day{ get_dif(item.expiry_date) > 1 ? 's' : null }</Text>
               :
               <Text style={{ color: get_dif( item.expiry_date ) > 6 ? 'green' : 'darkorange', fontSize:13 }}>Expires in { get_dif( item.expiry_date ) } day{ get_dif(item.expiry_date) > 1 ? 's' : null }</Text>
        }
               <Text style={{ color:'#999' }}>{moment(item.expiry_date).utcOffset('+03:00').format('dddd MMM Do')}</Text>
               </TouchableOpacity> 
  )}
        keyExtractor={item => item.id}
      />

       
</View>
<View style={{ backgroundColor:'#f8ca2c', paddingVertical:30, alignItems:'center' }}>

<Text style={{ margin:15, color:'#222', fontWeight:'bold', fontSize:28  }}>Browse Projects<Text style={{ color:'#cc0000' }}>.</Text></Text>
<Text style={{ color:'#222', marginBottom:15 }}>Explore beautiful work from Peza24 members</Text>
<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.portfolio_banner }} style={{ width:'100%', height: global.width * 0.35 }} />

<TouchableOpacity onPress={() => navigation.navigate( 'Projects' )} style={{ backgroundColor:'#f8ca2c', padding:10, marginTop:15, margin:10, alignItems:'center', width:'100%' }}>

  <Text style={{ color:'#222', fontWeight:'bold'  }}>EXPLORE <FontAwesome style={styles.iconstyle} size={13} name="arrow-right" /></Text>
</TouchableOpacity>
</View>
<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.services_banner }} resizeMode="cover" style={{ width:'100%', height: global.width * 0.667 }} />

<View style={{ backgroundColor:'#fff', alignItems:'center', paddingVertical:30 }}>
<Text style={{ marginTop:15, color:'#222', fontWeight:'bold', fontSize:28  }}>Discover Services<Text style={{ color:'#cc0000' }}>.</Text></Text>
<Text style={{ color:'#999' }}>Browse services available & prices</Text>
<TouchableOpacity onPress={() => navigation.navigate( 'Services' )} style={{ backgroundColor:'#ffff', padding:10, marginTop:20, alignItems:'center', width:'100%' }}>

  <Text style={{ color:'#222', fontWeight:'bold'  }}>FIND SERVICES <FontAwesome style={styles.iconstyle} size={13} name="arrow-right" /></Text>
</TouchableOpacity>

</View>

<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.awards_banner }} resizeMode="cover" style={{ width:'100%', height: global.width * 0.667 }} />


        </View>
    </ScrollView>
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
        flex:1,
        borderColor:'#ddd',
        borderWidth:1,
        backgroundColor:'#fff',
        padding:10,
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