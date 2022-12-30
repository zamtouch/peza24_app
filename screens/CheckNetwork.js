import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const MyApp = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('No internet connection', 'Please check your network connection and restart the app (close & OPen).');
    }

    const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });
    
      return unsubscribe;
      
  }, [isConnected]);

  return (
    <View style={{ justifyContent: 'center' }}>
      {!isConnected ? <Text style={{ color:'#fff', padding:15, backgroundColor:'#dd0000' }}>No internet connection. Please check your network connection and restart the app (close & Open).</Text>:null}
    </View>
  );
};

export default MyApp;