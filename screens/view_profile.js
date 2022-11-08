import React, { useState, useRef } from "react";
import { Text, View, FlatList, Image, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import VideoApp from "./inc/VideoApp";
import { Dimensions } from 'react-native';
import PortfolioApp from "./inc/PortfolioApp";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;




export default function Marketplace({route}) {

  const FirstRoute = () => (

    <View style={{ flex: 1, backgroundColor: '#fff', padding:10 }}>
               <FlatList
            data={ projects }
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => playProject(item)}
                key={item.id}
                style={{
                  flex: 1,
                  paddingRight: 10,
                  maxWidth: global.width * 0.48,
                  height: global.width * 0.45,
                  alignItems: "center",
                }}
              >
                { item.listing_type == 1 ?
                <ImageBackground
                  imageStyle={{
                    borderRadius: 5,
                    borderColor: "#ddd",
                    borderWidth: 1,
                  }}
                  source={{
                    uri:
                      "https://media.peza24.com/portfolio/thumbnail_" + item.featured_image,
                  }}
                  resizeMode="contain"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: global.width * 0.3,
                  }}
                ></ImageBackground> :
                <ImageBackground
                imageStyle={{
                  borderRadius: 5,
                  borderColor: "#ddd",
                  borderWidth: 1,
                }}
                source={{ uri: "https://img.youtube.com/vi/" + item.video_id + "/hqdefault.jpg" }}
                resizeMode="contain"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: global.width * 0.3,
                }}
              ></ImageBackground> }

             
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:11, minHeight:30, color:'#222' }}
                >
                  {item.project_name}
                </Text>
           
            
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
    </View>
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1 }}>
    <Text style={{ color:'red' }}>screen two</Text>
  </View>
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [user] = useState( route.params.user );
  const [loader, setLoader] = useState(true);
  const layout = useWindowDimensions();
  const [projects, setProjects] = useState([]);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Projects' },
    { key: 'second', title: 'About Me' },
  ]);

  const play = ( video_id ) => {
    global.play_video = video_id;
    childRef.current.getAlert()
  } 

  const get_data = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/portfolio?filter[user_created]="+user.id+"&filter[status]=published&limit=100&fields=*.*.*"
      ).then((resp) => resp.json()),
    ])
      .then(function (response) {
        setTimeout(function () {
          setLoader(false);
        }, 1000);

        setProjects(response[0].data);

      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  React.useEffect(() => {
    global.project = null;
    get_data();
  }, []);

  const playProject = (c) => {
    global.project = c;
    childRef2.current.getAlert();
  };

  const childRef = useRef(null);

  const childRef2 = useRef(null);

  return (
<View style={{ flex:1 }}>
<VideoApp ref={childRef} />
<PortfolioApp ref={childRef2} />
  {user.my_bio_video?
    <ImageBackground source={{ uri: "https://img.youtube.com/vi/" + user.my_bio_video + "/hqdefault.jpg" }} resizeMode="cover"  style={{ justifyContent:'center', alignItems:'center', height: global.width * 0.50, backgroundColor:'#222' }}>
    <TouchableOpacity onPress={() => play( user.my_bio_video )} >
    <Image source={require("../assets/play.png")} style={{ height:80 }} resizeMode="contain" />
</TouchableOpacity>
    </ImageBackground>:
    <View style={{ justifyContent:'center', alignItems:'center', height: global.width * 0.40, backgroundColor:'#222' }}></View>
  }
  <View style={{ alignItems:'center' }}>
    { user.profile_pic?
      <Image source={{ uri: "https://media.peza24.com/profile/" + user.profile_pic }} style={{ height:100, width: 100, borderRadius:100, borderColor:'#fff', borderWidth:4, marginTop:-50 }} />:
      null}
  </View>
  <View style={{ alignItems:'center', padding:10 }}>
  <Text>{ user.first_name }</Text>
  <Text style={{ color:'#999' }}>{ user.title }</Text>
  </View>


  <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width, flex:1 }}
    />
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex:1
  },
  scene: {
    flex: 1,
  },
});