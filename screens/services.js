import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import {
  FontAwesome,
} from "@expo/vector-icons";
import ServiceApp from "./inc/ServiceApp";
import DropDownPicker from "react-native-dropdown-picker";
import Loader from "./inc/Loader";

export default function Home({ navigation }) {

  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const [promos, setPromos] = useState([]);
  const [loader, setLoader] = useState(true);
  const [site, setSite] = useState({
    home_wallpaper: "google.com",
    network_banner: "google.com",
    awards_banner: "google.com",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(14);
  const [items, setItems] = useState([
    { label: "Spain", value: "spain" }
  ]);

  const [category, setCategory] = useState([]);

  const get_promo_count = ( item, data ) => {
    if (item == 14) {
      return data.length;
    }

    var data = data.filter(function (value) {
      return value.main_category?.id == item;
    });

    return data.length;
  };

  const change_category = (category) => {
    if (category == 14) {
      setFilteredDataSource(masterDataSource);

      return;
    }
    //setSelected(event.target.value);
    var data = masterDataSource.filter(function (value) {
      return value.main_category?.id == category;
    });

    setFilteredDataSource(data);
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.description
          ? item.description.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };



  const playProject = (c) => {
    global.project = c;
    childRef.current.getAlert();
  };

  const get_data = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/main_categories?limit=100"
      ).then((resp) => resp.json()),
      fetch("https://cms.peza24.com/items/site_defaults").then((resp) =>
        resp.json()
      ),
      fetch(
        "https://cms.peza24.com/items/services?filter[status]=published&limit=100&fields=*.*.*"
      ).then((resp) => resp.json()),
    ])
      .then(function (response) {
        setTimeout(function () {
          setLoader(false);
        }, 1000);

        setSite(response[1].data);

        const transformed = response[0].data.map(({ id, name }) => ({
          label: name + " (" + get_promo_count( id, response[2].data ) + ")",
          value: id,
        }));

        setFilteredDataSource(response[2].data);
        setMasterDataSource(response[2].data);

        setCategory(transformed);
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

  const childRef = useRef(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
           {loader? <Loader /> : null }
      <ServiceApp ref={childRef} />
   
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text
          style={{ flex: 1, fontSize: 20, fontWeight: "bold", marginLeft: 15 }}
        >
          Find a service<Text style={{ color: "#cc0000" }}>.</Text>
        
        </Text>
       
        <Text style={{ marginRight: 15, fontSize: 16, color: "#777" }}>
          {filteredDataSource.length + " Listings"}
        </Text>
      </View>
      <Text style={{ marginLeft:15, color:'#999' }}>Explore services listed by Zambian Freelances</Text>
      <View style={{ padding: 15, flex: 1 }}>
        <View
          style={{
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            marginBottom: 10,
          }}
        >
          <DropDownPicker
            open={open}
            value={value}
            items={category}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={(value) => {
              change_category(value);
            }}
            theme="DARK"
            multiple={false}
            mode="BADGE"
            badgeDotColors={[
              "#e76f51",
              "#00b4d8",
              "#e9c46a",
              "#e76f51",
              "#8ac926",
              "#00b4d8",
              "#e9c46a",
            ]}
          />
        </View>
        <View style={{ flex: 1 }}>
        <TextInput
        style={{ paddingHorizontal:10, paddingVertical:15, borderWidth:1, borderColor:'#ddd', borderRadius:10, marginBottom:10 }}
        onChangeText={ value => { searchFilterFunction(value) } }
        placeholder="Search by keyword"
      />
          <FlatList
            data={filteredDataSource}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => playProject(item)}
                key={item.id}
                style={{
                  flex: 1,
                borderColor:'#ddd',
                borderRadius:10,
                borderWidth:1,
                  width:'100%',
             marginBottom:15,
                  alignItems: "center",
                }}
              >
                { item.listing_type == 1 ?
                <ImageBackground
                  imageStyle={{
                    borderRadius: 5,
             
                  }}
                  source={{
                    uri:
                      "https://media.peza24.com/services/thumbnail_" + item.featured_image,
                  }}
                  resizeMode="contain"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: global.width * 0.5,
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
                  numberOfLines={1}
            
                  style={{ marginTop: 10, fontSize:14,fontWeight:'bold', minHeight:30, color:'#222' }}
                >
                  {item.name}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ fontSize:11, minHeight:30, color:'#222' }}
                > {item.description}</Text>

<Text
                  numberOfLines={1}
            
                  style={{ marginTop: 10, fontSize:14,fontWeight:'bold', minHeight:30, color:'#222' }}
                >
                 From K{item.basic_plan_price}
                </Text>
           <View style={{ borderColor:'#ddd', borderWidth:0.5, width:'100%', marginVertical:10 }}></View>
           <TouchableOpacity onPress={ () => { navigation.navigate( "ViewProfile", {
              user: item.user_created
            } ) } } style={{ flexDirection:'row', paddingLeft:10, marginBottom:15}}>
           <Image source={{ uri: "https://media.peza24.com/profile/" + item.user_created.profile_pic }} style={{ height:60, width: 60, borderRadius:60, borderColor:'#fff', borderWidth:4 }} />
   <View style={{ flex:1, justifyContent:'center', paddingLeft:15 }}>
    <Text>{item.user_created.first_name}</Text>
    <Text style={{ fontSize:11, color:'#999' }}>View Profile</Text>
    </View> 
           </TouchableOpacity>
           </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ECF0F1",
  },
  iconstyle: {
    color: "#777",
  },
  iconButtons: {
    alignItems: "center",
    marginRight: 15,
    width: 100,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
  },
  icontext: {
    color: "#444",
    fontSize: 11,
    marginTop: 5,
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: "center",
    marginBottom: 8,
  },
});
