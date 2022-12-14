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
import Loader from "./inc/Loader";
import CatalogueApp from "./inc/CatalogueApp";
import DropDownPicker from "react-native-dropdown-picker";

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
    { label: "Spain", value: "spain" },
    { label: "Madrid", value: "madrid" },
    { label: "Barcelona", value: "barcelona" },

    { label: "Italy", value: "italy" },
    { label: "Rome", value: "rome" },

    { label: "Finland", value: "finland" },
  ]);

  const [category, setCategory] = useState([]);

  const get_promo_count = ( item, data ) => {
    if (item == 14) {
      return data.length;
    }

    var data = data.filter(function (value) {
      return value.catalogue_category?.id == item;
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
      return value.catalogue_category?.id == category;
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
        const itemData = item.store
          ? item.store.toUpperCase()
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

  const playCatalogue = (c) => {
    global.catalogue = c;
    childRef2.current.getAlert();
  };

  const get_data = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/catalogue_categories?sort=order&limit=100"
      ).then((resp) => resp.json()),
      fetch("https://cms.peza24.com/items/site_defaults").then((resp) =>
        resp.json()
      ),
      fetch(
        "https://cms.peza24.com/items/sales_and_promos?filter[status]=published&sort=-date_created&limit=100&fields=*.*.*&filter[expiry_date][_gte]=$NOW"
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

  const get_dif = (date) => {
    var a = moment( date );
    var b = moment();
    return a.diff( b, 'days' );
  }

  React.useEffect(() => {
    get_data();
  }, []);

  const childRef = useRef(null);
  const childRef2 = useRef(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CatalogueApp ref={childRef2} />
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text
          style={{ flex: 1, fontSize: 20, fontWeight: "bold", marginLeft: 15 }}
        >
          Latest Sales & Promos<Text style={{ color: "#cc0000" }}>.</Text>
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
        placeholder="Search by store name"
      />
          <FlatList
            data={filteredDataSource}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => playCatalogue(item)}
                key={item.id}
                style={{
                  flex: 1,
                  paddingRight: 10,
                  maxWidth: global.width * 0.49,
                  height: global.width * 0.95,
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  imageStyle={{
                    borderRadius: 5,
                    borderColor: "#ddd",
                    borderWidth: 1,
                  }}
                  source={{
                    uri:
                      "https://cms.peza24.com/assets/" + item.featured_image.id,
                  }}
                  resizeMode="contain"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: global.width * 0.6,
                  }}
                ></ImageBackground>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontWeight: "bold" }}
                >
                  {item.store.toUpperCase()}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ marginTop: 10, fontSize:11, minHeight:30 }}
                >
                  {item.title}
                </Text>
                {get_dif( item.expiry_date ) < 3 ?
               <Text style={{ color: 'red', fontSize:13 }}>Expires in { get_dif( item.expiry_date ) } day{ get_dif(item.expiry_date) > 1 ? 's' : null }</Text>
               :
               <Text style={{ color: get_dif( item.expiry_date ) > 6 ? 'green' : 'darkorange', fontSize:13 }}>Expires in { get_dif( item.expiry_date ) } day{ get_dif(item.expiry_date) > 1 ? 's' : null }</Text>
        }
                <Text style={{ color:'#999' }}>
                  {moment(item.expiry_date)
                    .utcOffset("+03:00")
                    .format("dddd MMM Do")}
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
