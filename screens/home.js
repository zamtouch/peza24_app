import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import moment from "moment";
import { Feather, FontAwesome, FontAwesome5, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import VideoApp from "./inc/VideoApp";
import CalculatorApp from "./inc/CalculatorApp";
import Loader from "./inc/Loader";
import CatalogueApp from "./inc/CatalogueApp";

export default function Home({navigation}) {

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
        awards_banner:'google.com',
      });
    
      const play = ( video_id ) => {
        global.play_video = video_id;
        childRef.current.getAlert()
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
          fetch("https://cms.peza24.com/items/podcast_videos?sort=-date_created&limit=5").then(
            (resp) => resp.json()
          ),
          fetch(
            "https://cms.peza24.com/items/job_listings?limit=5&fields=*.*.*&sort=-date_created"
          ).then((resp) => resp.json()),
          fetch(
            "https://cms.peza24.com/items/fx_rates/1"
          ).then((resp) => resp.json()),
          fetch(
            "https://cms.peza24.com/users?fields=*.*.*&limit=5&filter[featured_profile]=true"
          ).then((resp) => resp.json()),
          fetch(
            "https://cms.peza24.com/items/sales_and_promos?&sort=-date_created&filter[status]=published&limit=4&fields=*.*.*"
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
    
            setJobs(response[2].data);
            setRates(response[3].data);
            setUsers(response[4].data);
            setPromos(response[5].data);
    
    
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
      const childRef3 = useRef(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor:'#fff' }}>
      {loader? <Loader /> : null }
          <VideoApp ref={childRef} />
          <CatalogueApp ref={childRef2} />
          <CalculatorApp ref={childRef3} />
        <View style={{ flexDirection:'row', padding:15 }}>
        <View style={{ flex:1 }}>
        
            <View style={{ marginTop:15 }}>
     
            <Text style={{ fontSize:24, fontWeight:'bold' }}>{greet}<Text style={{ color:'#cc0000' }}>.</Text></Text>
            <Text style={{ color:'#999' }}>{moment().utcOffset('+03:00').format('dddd MMM Do YYYY')}</Text>
            </View>
         
            </View>

            <View style={{ flex:1 }}>
            <Text style={{ color:'#777', margin:5 }}>Exchange Calculator</Text>
              <View style={{ flexDirection:'row', }}>

                <View style={{ flexDirection:'row', flex:1, borderRadius:5, borderWidth:0.5, padding:10, margin:5, borderColor:'#ddd' }}>

               
                <TouchableOpacity onPress={ () => calc( rates.usd.toFixed(2), 'USD' ) }>
                <Text style={{ fontWeight:'bold', fontSize:11 }}>USD</Text>
                <Text>K{rates.usd.toFixed(2)}</Text>
                </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection:'row', flex:1, borderRadius:5, borderWidth:0.5, padding:10, margin:5, borderColor:'#ddd' }}>


<View>
<Text style={{ fontWeight:'bold', fontSize:11 }}>ZAR</Text>
<Text>K{rates.rand.toFixed(2)}</Text>
</View>
</View>
</View>
                </View>
        </View>

        <View>

        <View style={{ flexDirection:'row', marginTop:20 }}>
        <Text style={{ flex:1, fontSize:20, fontWeight:'bold', marginLeft: 15 }}>Zambian & African Podcasts<Text style={{ color:'#cc0000' }}>.</Text></Text>
        <TouchableOpacity onPress={ () => { navigation.navigate( 'Podcasts' ) } }><Text style={{ marginRight:15, fontSize:20, color:'#999' }}>See all</Text></TouchableOpacity>
</View>

        
        <View style={{ flexDirection:'row', padding:15 }}>
    
        <FlatList
        horizontal={true}
        data={fv}
        renderItem={ ({item}) => (
            <View key={item.id} style={{  width: global.width * 0.75, paddingRight:15, height: global.width * 0.58 }}>
       
        
              <ImageBackground imageStyle={{ borderRadius:5 }} source={{ uri: "https://img.youtube.com/vi/" + item.video_id + "/hqdefault.jpg" }} resizeMode="cover" style={{ alignItems:'center', justifyContent:'center', width:'100%', height: global.width * 0.45 }}>
        <TouchableOpacity onPress={() => play( item.video_id )} >
        <Image source={require("../assets/play.png")} style={{ height:80 }} resizeMode="contain" />
        </TouchableOpacity>
              </ImageBackground>
           
         
               <Text numberOfLines={2} ellipsizeMode='tail' style={{ marginTop: 10,  }}>{item.title}</Text>
               </View> 
  )}
        keyExtractor={item => item.id}
      />

       
</View>

<ScrollView horizontal={true}>
      <View style={{ flexDirection:'row', marginLeft:15, marginBottom:15 }}>

      <TouchableOpacity onPress={ () => { navigation.navigate( 'Podcasts' ) } }>
        <View style={styles.iconButtons}>
            <Ionicons style={styles.iconstyle} size={24} name="videocam-outline" />
            </View>
            <Text style={styles.icontext}>Podcasts</Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={ () => { navigation.navigate( 'Projects' ) } }>
        <View style={styles.iconButtons}>
            <FontAwesome5 style={styles.iconstyle} size={24} name="images" />
            </View>
            <Text style={styles.icontext}>Freelance Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={ () => { navigation.navigate( 'Projects' ) } }>
        <View style={styles.iconButtons}>
            <FontAwesome5 style={styles.iconstyle} size={24} name="users" />
            </View>
            <Text style={styles.icontext}>Freelance Services</Text>
        </TouchableOpacity>



        <TouchableOpacity onPress={ () => { navigation.navigate( 'Projects' ) } }>
        <View style={styles.iconButtons}>
            <FontAwesome5 style={styles.iconstyle} size={24} name="images" />
            </View>
            <Text style={styles.icontext}>Company Projects</Text>
        </TouchableOpacity>



        <TouchableOpacity onPress={() => report(1)}>
        <View style={styles.iconButtons}>
            <Ionicons style={styles.iconstyle} size={24} name="ios-trophy-outline" />
            </View>
            <Text style={styles.icontext}>Annual Awards</Text>
        </TouchableOpacity>
 
      </View>
      </ScrollView>
<View style={{ flexDirection:'row', marginTop:20 }}>
<Text style={{ flex:1, fontSize:20, fontWeight:'bold', marginLeft: 15 }}>Latest Sales & Promos<Text style={{ color:'#cc0000' }}>.</Text></Text>
<TouchableOpacity onPress={ () => { navigation.navigate( 'Promos' ) } }><Text style={{ marginRight:15, fontSize:20, color:'#777' }}>See all</Text></TouchableOpacity>
</View>

        <View style={{ flexDirection:'row', padding:15, marginBottom:15 }}>
    
        <FlatList
        horizontal={true}
        data={promos}
        renderItem={ ({item}) => (
            <TouchableOpacity onPress={() => playCatalogue( item )} key={item.id} style={{  width: global.width * 0.40, paddingRight:10, height: global.width * 0.85 }}>
       
        
              <ImageBackground imageStyle={{ borderRadius:5, borderColor:'#ddd', borderWidth:1 }} source={{ uri: "https://cms.peza24.com/assets/" + item.featured_image.id }} resizeMode="contain" style={{ alignItems:'center', justifyContent:'center', width:'100%', height: global.width * 0.60 }}>
   
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
<View style={{ backgroundColor:'#f8ca2c', paddingVertical:15 }}>
<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.portfolio_banner }} style={{ width:'100%', height: global.width * 0.35 }} />
<TouchableOpacity onPress={() => navigation.navigate( 'Projects' )} style={{ backgroundColor:'#f8ca2c', padding:15, alignItems:'center', width:'100%' }}>
  <Text style={{ color:'#222' }}>Explore beautiful work from Peza24 members</Text>
  <Text style={{ margin:15, color:'#222', fontWeight:'bold'  }}>VIEW PROJECTS <FontAwesome style={styles.iconstyle} size={13} name="arrow-right" /></Text>
</TouchableOpacity>
</View>
<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.network_banner }} style={{ width:'100%', height:300 }} />
<View style={{ backgroundColor:'#fff', padding:15, alignItems:'center', width:'100%' }}>
  <Text style={{ color:'#999' }}>Join the Peza24 community today</Text>
  <TouchableOpacity style={{ margin:10, backgroundColor:'transparent', borderColor:'#999', borderWidth:1, borderRadius:10 }}><Text style={{ margin:15, color:'#222',  }}>Create Account / Login</Text></TouchableOpacity>
</View>

<Image source={{ uri: 'https://cms.peza24.com/assets/' + site?.awards_banner }} style={{ width:'100%', height:300 }} />
<View style={{ backgroundColor:'#fff', padding:15, alignItems:'center', width:'100%' }}>
  <Text style={{ color:'#999' }}>Join the Peza24 community today</Text>
  <TouchableOpacity style={{ margin:10, backgroundColor:'transparent', borderColor:'#999', borderWidth:1, borderRadius:10 }}><Text style={{ margin:15, color:'#222',  }}>Learn More</Text></TouchableOpacity>
</View>

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