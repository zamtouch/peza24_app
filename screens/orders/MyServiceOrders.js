import React, { useState, useRef } from "react";
import { Text, View, FlatList, Image, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import moment from "moment";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function MyServiceOrders({navigation}) {

    const get_status = ( status, query_type ) => {

        var statement = "";
        var color = "";

        switch ( status ) {
            case '0':
              statement = "Pending Approval";
              color = "orange";
              break;
            case '1':
              statement = "Pending Payment";
              color = "darkorange";
              break;
            case '2':
               statement = "In Progress";
               color = "yellowgreen";
              break;
            case '3':
              statement = "Completed";
              color = "darkgreen";
              break;
            case '4':
                statement = "In Review";
                color = "darkorange";
              break;
            case '5':
                statement = "Cancelled";
              color = "#bb0000";
          }

          if ( query_type < 1 ) {
          return statement;
          } else {
            return color;
          }

    }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#cc0000' }}
      style={{ backgroundColor: '#000020'  }}
    />
  );

  const FirstRoute = () => (

    <View style={{ flex: 1, backgroundColor: '#fff', padding:10 }}>
               <FlatList
            data={ orders }
            renderItem={({ item }) => (
                <View style={{ borderColor:'#ddd', borderWidth:1, borderRadius:5, marginVertical:10 }}>
              <TouchableOpacity onPress={() => navigation.navigate('OrderInfo', { order: item.id })}
                style={{ borderColor:'#ddd', borderWidth:1, borderRadius:5, padding:15 }}
                key={item.id}
              >
             
             <View style={{ flexDirection:'row' }}>

                <View style={{ flex:3 }}></View>
                <View style={{ flex:2 }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:11, color: get_status( item.status, 1 )}}
                >
                 <FontAwesome style={styles.iconstyle} size={14} name="circle" /> { get_status( item.status, 0 ) }
                </Text>
                {item.buyer_chat_pending > 0?
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:11, color: '#bb0000'}}
                >
                 <FontAwesome style={styles.iconstyle} size={14} name="comment" /> Message from seller
                </Text>: null}
                </View>
       
             </View>
        

             
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:28, color:'#222' }}
                >
                 <FontAwesome style={styles.iconstyle} size={28} name="shopping-cart" /> K{item.total}
                </Text>

                      
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:16, color:'#222', marginVertical:10 }}
                >
                  {item.name}
                </Text>
                <Text style={{ color:'#999' }}>Order Created: {moment(item.date_created).startOf('day').fromNow()}</Text>
            
              </TouchableOpacity>

              <TouchableOpacity onPress={ () => { navigation.navigate( "ViewProfile", {
              user: item.seller
            } ) } } style={{ flexDirection:'row', padding:10}}>
           <Image source={{ uri: "https://media.peza24.com/profile/" + item.seller.profile_pic }} style={{ height:35, width: 35, borderRadius:35, borderColor:'#fff', borderWidth:4 }} />
   <View style={{ flex:1, justifyContent:'center', paddingLeft:15 }}>
   <Text style={{ fontSize:11, color:'#999' }}>Seller</Text>
    <Text numberOfLines={1} style={{ fontSize:12, fontWeight:'bold' }}>{item.seller.account_type == 3 ? item.seller.company_name : item.seller.first_name}</Text>

    </View> 
           </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
    </View>
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1, padding:15 }}>
        
  </View>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1, padding:15 }}>

  </View>
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });


  const [loader, setLoader] = useState(true);
  const layout = useWindowDimensions();
  const [ orders, setOrders ] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'In Progress' },
    { key: 'second', title: 'Completed' },
    { key: 'third', title: 'Canceled' },
  ]);

  const play = ( video_id ) => {
    global.play_video = video_id;
    childRef.current.getAlert()
  } 

  const get_data = () => {
    Promise.all([
      fetch(
        "https://app.peza24.com/mobile/my-orders-services.php?a="+global.access_token
      ).then((resp) => resp.json())
    ])
      .then(function (response) {
        setTimeout(function () {
          setLoader(false);
        }, 1000);

        setOrders(response[0].data);
     //   setServices(response[1].data);

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

  const playProject2 = (c) => {
    global.project = c;
    childRef3.current.getAlert();
  };

  const childRef = useRef(null);

  const childRef2 = useRef(null);

  const childRef3 = useRef(null);

  return (
<View style={{ flex:1 }}>
  <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: layout.width, flex:1, backgroundColor:'red' }}
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
