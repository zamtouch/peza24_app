import React, { useState, useRef } from "react";
import { Alert, Text, View, FlatList, Image, StatusBar, StyleSheet, Pressable, Modal, ImageBackground, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import moment from "moment";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function MyServiceOrders({navigation, route}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [msg, setMsg] = useState('');
    let status;


    const  showConfirmation = (navigation) => {
      Alert.alert(
        'Confirm',
        'Are you ready to submit?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate( 'DeliverOrder' ),
          },
        ],
        { cancelable: false }
      );
    }

    const send_chat = () => {

        if ( msg == null ) {
        return;
        }

        const options = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              from: orders.seller.first_name,
              msg: msg,
              order: orders.id
            }),
          };
      
          fetch("https://app.peza24.com/api/service_seller_chat_save.php?a="+global.access_token, options)
            .then((response) => response.json())
            .then((response) => {
              if ( response.status == "success" ) {
            //refresh order
            get_data();
      
              } else {
                alert(response.errors[0].message);
              }
            })
            .catch((err) => console.error(err));
        

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

 <Text style={{ fontSize:16, fontWeight:'bold' }}>Project Summary</Text>
                <View style={{ borderColor:'#ddd', borderWidth:1, borderRadius:5, padding:15, marginVertical:10 }}>
        
             
             <View>

           
                <View>
                  {status}
             
                {orders.buyer_chat_pending > 0?
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
                 <FontAwesome style={styles.iconstyle} size={28} name="shopping-cart" /> K{orders.total}
                </Text>

                      
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:16, color:'#222', marginVertical:10 }}
                >
                  {orders.name}
                </Text>
                <Text style={{ color:'#999' }}>Order Created: {moment(orders.date_created).startOf('day').fromNow()}</Text>
            
    

          
              </View>
              <Text style={{ fontSize:16, fontWeight:'bold' }}>Project Requirements</Text>
              <View style={{ borderColor:'#ddd', borderWidth:1, borderRadius:5, padding:15, marginVertical:10 }}>
        
<Text>{orders.requirements}</Text>
        </View>
    </View>
  );
  
  const SecondRoute = () => (
    
   
    <View style={{ flex: 1, padding:15, backgroundColor:'#f0f0f0' }}>
        
        <View style={{ flex:1 }}>

                {orders.chat == null ? 
            <Text>No chat messages available</Text>: 
            
            <FlatList

            data={orders.chat}
            keyExtractor={item => item.job_id}
            renderItem={({ item }) => (
            
            
                <View style={styles.metaInfo}>
                        { item.sender_id == orders.user_created.id ?
                    <View style={{ padding:15, backgroundColor:'#fff', borderRadius:15, marginBottom:15, alignItems:'flex-end', marginRight:100 }}>
                  <Text style={{ fontWeight:'bold' }}>{item.from} (Client):</Text>   
                        <Text style={{ padding:5 }}>{item.msg}</Text>
                        <Text style={{ color:'#999' }}>{moment(item.created).calendar()}</Text>
                </View>
:
<View style={{ padding:15, backgroundColor:'#d9fdd3', borderRadius:15, marginBottom:15, alignItems:'flex-end', marginLeft:100 }}>
<Text style={{ fontWeight:'bold' }}>You:</Text>            
<Text style={{ padding:5 }}>{item.msg}</Text>
<Text style={{ color:'#999' }}>{moment(item.created).calendar()}</Text>
</View>
}

                </View>
             
                
            
            )}
          />
            }

        </View>

        <View>
  
             <Pressable style={[styles.button, {backgroundColor:'#cc0000'} ]} onPress={() => { setModalVisible(true) }}>
          <Text style={{ color:'#fff' }}>Send buyer a message</Text>
        </Pressable>
        </View>
      
  </View>

  );

  const ThirdRoute = () => (
    <View style={{ flex: 1, padding:15 }}>

  </View>
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  });

  const [o] = useState( route.params.order );
  const [loader, setLoader] = useState(true);
  const layout = useWindowDimensions();
  const [ orders, setOrders ] = useState([]);
  const [ messages, setMessages ] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Summary' },
    { key: 'second', title: 'Messages' },
  ]);


  const submit_for_review = () => {

    //confirm if complete?
  
    fetch(
      "https://app.peza24.com/mobile/service_orders/approve_order?order_id="+o+"&a="+global.access_token)
      .then((response) => response.json())
      .then((response) => {

    console.log(response);

    if (response.hasOwnProperty("data")) {
    
      get_data();
      alert("Update successful");

    } else {
      alert(response.errors[0].message);
    }

  })
  .catch((err) => console.error(err));

}

  const approve_order = () => {

    
  
      fetch(
        "https://app.peza24.com/mobile/service_orders/approve_order?order_id="+o+"&a="+global.access_token)
        .then((response) => response.json())
        .then((response) => {

      console.log(response);

      if (response.hasOwnProperty("data")) {
      
        get_data();
        alert("Update successful");
 
      } else {
        alert(response.errors[0].message);
      }

    })
    .catch((err) => console.error(err));

  }



  const get_data = () => {

    Promise.all([
      fetch(
        "https://app.peza24.com/mobile/get_service_order_manager?order_id="+o+"&a="+global.access_token+"&fields=*.*.*"
      ).then((resp) => resp.json())
    ])
    .then(function (response) {

          setLoader(false);


        setOrders(response[0].data[0]);
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

  let my_button;


  switch ( orders.status ) {

  

    case '0':
      //pending approval
      my_button = <Pressable onPress={ () => approve_order() } style={[styles.button, {backgroundColor:'#fff', borderColor:'#ddd', borderWidth:1, marginVertical:15 } ] }><Text style={{ color:'#444' }}>Approve Order</Text></Pressable>;
      status = <Text style={{ color:'orange' }}>Pending your approval</Text>
      break;
    case '1':
     //"Pending Payment";
     status = <Text style={{ color:'red' }}>Pending payment from buyer</Text>
      break;
    case '2':
      // statement = "In Progress";
      my_button = <Pressable onPress={ () => showConfirmation(navigation) } style={[styles.button, {backgroundColor:'yellowgreen', borderColor:'#ddd', borderWidth:1, marginVertical:15 } ] }><Text style={{ color:'#fff' }}>Submit for review</Text></Pressable>;
   
      status = <Text style={{ color:'green' }}>Paid. Please complete project before deadline.</Text>;
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

  return (
<View style={{ flex:1, padding:15, backgroundColor:'#fff' }}>
<KeyboardAvoidingView
    behavior={Device.brand === "apple" ? "padding" : "height"}
  >
        <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View>
        <TextInput

          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 5,
          
          }}
          onChangeText={(value) => {
            setMsg(value);
          }}
          placeholder={"Type your message.."}
        />
             <Pressable style={[styles.button]} onPress={ () => { send_chat(), setModalVisible(false) } }>
          <Text style={{ color:'#fff' }}>Send</Text>
        </Pressable>
        </View>
       
          </View>
          <Pressable
              style={{ padding:15, borderWidth:1, borderColor:'#ddd', borderRadius:30, margin:15 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{ color:'#ddd' }}>Close</Text>
            </Pressable>
        </View>
      </Modal>
      </KeyboardAvoidingView>
      {my_button}
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
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginVertical: 15,
    backgroundColor: "#cc0000",
    alignItems: "center",
  },
    centeredView: {
      flex: 1,
      justifyContent: "center",
        padding:'5%',
        backgroundColor:'rgba(0,0,0,0.85)',
        zIndex:900
    },
    modalView: {
      margin: 10,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });