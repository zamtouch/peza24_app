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
import VideoApp from "./inc/VideoApp";
import DropDownPicker from "react-native-dropdown-picker";
import Loader from "./inc/Loader";

export default function Home() {

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
      return value.category?.id == item;
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
      return value.category?.id == category;
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
        const itemData = item.project_name
          ? item.project_name.toUpperCase()
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

  const play = (video_id) => {
    global.play_video = video_id;
    childRef.current.getAlert();
  };

  const get_data = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/podcast_categories?limit=100"
      ).then((resp) => resp.json()),
      fetch("https://cms.peza24.com/items/site_defaults").then((resp) =>
        resp.json()
      ),
      fetch(
        "https://cms.peza24.com/items/podcast_videos?filter[status]=published&sort=-date_created&limit=100&fields=*.*.*"
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
    get_data();
  }, []);

  const childRef = useRef(null);


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
              {loader? <Loader /> : null }
      <VideoApp ref={childRef} />

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text
          style={{ flex: 1, fontSize: 20, fontWeight: "bold", marginLeft: 15 }}
        >
          Podcasts<Text style={{ color: "#cc0000" }}>.</Text>
        </Text>
        <Text style={{ marginRight: 15, fontSize: 16, color: "#777" }}>
          {filteredDataSource.length + " Listings"}
        </Text>
      </View>

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
        style={{ paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderColor:'#ddd', borderRadius:10, marginBottom:10 }}
        onChangeText={ value => { searchFilterFunction(value) } }
        placeholder="Search by keyword"
      />
          <FlatList
            data={filteredDataSource}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => play(item.video_id)}
                key={item.id}
                style={{
                  flex: 1,
                  paddingRight: 10,
                  maxWidth: global.width * 0.49,
                  height: global.width * 0.55,
                  alignItems: "center",
                }}
              >
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
                ></ImageBackground>

             
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:11, minHeight:30, color:'#222' }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#999", fontSize: 13, textTransform: 'lowercase' }}>
                <FontAwesome style={styles.iconstyle} size={13} name="users" /> {item.name}
                </Text>
            
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
