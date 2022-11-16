import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from "./inc/Loader";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function ProfilePage({ route }) {

  const [loader, setLoader] = useState(true);

  React.useEffect(() => {
   
  }, []);

  return (
<View style={{ flex:1 }}>
<WebView
      style={{ flex:1 }}
      source={{ uri: "https://app.peza24.com/mobile/order-service.php?a="+global.access_token+"&s="+route.params.service_id+"&plan="+route.params.plan }}
    />
</View>
  );
}
