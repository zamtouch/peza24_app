import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable,Image, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native'

const PortfolioApp = forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
  
    getAlert() {
      console.log( global.project );
      setModalVisible( true );
  }

  }));

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#cc0000' }}
      style={{ backgroundColor: '#000020'  }}
    />
  );

  const FirstRoute = () => (

    <View style={{ flex: 1, backgroundColor: '#fff', padding:15 }}>
            <Text style={{ fontWeight:'bold', fontSize:20, marginBottom:15 }}>K{global.project.basic_plan_price}</Text>
            <Text>{global.project.basic_plan_description}</Text>
    </View>
  );
  
  const SecondRoute = () => (
    <View style={{ flex: 1, padding:15 }}>
          <Text style={{ fontWeight:'bold', fontSize:20, marginBottom:15 }}>K{global.project.standard_plan_price}</Text>
    <Text>{global.project.standard_plan_description}</Text>
  </View>
  );

  const ThirdRoute = () => (
    <View style={{ flex: 1, padding:15 }}>
          <Text style={{ fontWeight:'bold', fontSize:20, marginBottom:15 }}>K{global.project.premium_plan_price}</Text>
    <Text>{global.project.premium_plan_description}</Text>
  </View>
  );
  
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Basic' },
    { key: 'second', title: 'Standard' },
    { key: 'third', title: 'Premium' },
  ]);



  if (global.project) {

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ flex:1 }}>
            { global.project?.listing_type == 1 ?
          <Image
                  imageStyle={{
                    borderRadius: 5,
                    borderColor: "#ddd",
                    borderWidth: 1,
                  }}
                  source={{
                    uri:
                      "https://media.peza24.com/services/" + global.project?.featured_image,
                  }}
                  resizeMode="contain"
                  style={{
                  
                    width: "100%",
                    height: global.width * 0.6,
                    backgroundColor:'#f0f0f0'
                  }}
                ></Image> :
                <WebView
                style={{ flex:1, borderRadius:10, height: global.width * 0.6 }}
                source={{ uri: 'https://www.youtube.com/embed/' + global.project?.video_id }}
              />
}

    <View style={{ alignItems:'center', marginBottom:30 }}>
    <Text style={{ marginVertical:15, fontWeight:'bold', fontSize:16 }}>{global.project.name}</Text>

        <Text style={{ marginTop:15, fontWeight:'bold' }}>Description</Text>
        <Text>{global.project.description}</Text>
   
      
    </View>
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: layout.width, flex:1, backgroundColor:'red' }}
    />
    </View>
                   <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );

}
});

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.85)'
  },
  modalView: {

    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    height:'90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop:30
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#dd0000',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PortfolioApp;