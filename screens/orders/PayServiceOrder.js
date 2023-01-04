import React, { useState, useRef } from "react";
import { Text, View, Image } from 'react-native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Loader from "../inc/Loader";

global.width = Dimensions.get('window').width;
global.height = Dimensions.get('window').height;

export default function ProfilePage(props) {

  const [loader, setLoader] = useState(true);
  const {route} = props;
  const order_id = route.params.order_id;
  const amount = route.params.amount;

  return (
<View style={{ flex:1, backgroundColor:'#fff' }}>
{loader? <Loader /> : null }
<WebView
      style={{ flex:1 }}
      onLoad={() => setLoader(false) }
      source={{ uri: 'https://app.peza24.com/sparco-pay/pay-service.php?i='+order_id+'&a='+global.access_token+'&amount='+amount }}
    />
</View>
  );
}
