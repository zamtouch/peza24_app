import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity,TextInput, Component } from 'react-native';
import moment from "moment";
import { Ionicons, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import JobApp from "./inc/JobApp";
import DropDownPicker from 'react-native-dropdown-picker';
import Loader from "./inc/Loader";
//import Dropdown from './components/Dropdown';

export default function Profile() {

  //dropdown
  const [value, setValue] = useState(17);
  const [loader, setLoader] = useState(true);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [items, setItems] = useState([
    { label: "Spain", value: "spain" },
    { label: "Madrid", value: "madrid" },
    { label: "Barcelona", value: "barcelona" },

    { label: "Italy", value: "italy" },
    { label: "Rome", value: "rome" },

    { label: "Finland", value: "finland" },
  ]);
  //search 
  const [data2, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState("");
  //jobs
  const [jobs, setJobs] = useState([]);



  //fetch data from api
  const get_jobs = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/job_listings?limit=100&fields=*.*.*&sort=-date_created"
      ).then((resp) => resp.json()),
      fetch(
        "https://cms.peza24.com/items/job_categories?"
      ).then((resp) => resp.json())
    ])
      .then(function (response) {
        setTimeout(function () {
          setLoader(false);
        }, 1000);
        
        setJobs(response[0].data);
        setData(response[0].data);
       // setCategory(response[1].data);

        const transformed = response[1].data.map(({ id, category_name }) => ({
          label: category_name + " (" + get_category_count( id, response[0].data ) + ")",
          value: id,
        }));

        setFilteredDataSource(response[0].data);
        setMasterDataSource(response[0].data);

        setCategory(transformed);

      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };


  const play = (job_id) => {
    global.job = job_id;
    childRef.current.getAlert();
  };

  React.useEffect(() => {
    get_jobs();
  },[]) 

  const childRef = useRef(null);
  // search render function
  function renderHeader() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          marginVertical: 10,
          borderRadius: 20
        }}
      >
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          value= {query}
          onChangeText={queryText => handleSearch(queryText)}
          placeholder="Search"
          style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}
        />
      </View>
    );
  }

  const get_category_count = ( item, data ) => {
    if (item == 17) {
      return data.length;
    }

    var data = data.filter(function (value) {
      return value.job_category?.id == item;
    });

    return data.length;
  };

  const change_category = (category) => {
    if (category == 17) {
      setFilteredDataSource(masterDataSource);

      return;
    }
    //setSelected(event.target.value);
    var data = masterDataSource.filter(function (value) {
      return value.job_category?.id == category;
    });

    setFilteredDataSource(data);
  };

  // Search Handler 
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.job_title
          ? item.job_title.toUpperCase()
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

  const contains = ({ job_title, job_description }, query) => {
    //const { job_title, job_company } = name;
  
    if ( job_title.includes(query) || job_description.includes(query)) {
      return true;
    }
  
    return false;
  };


    return ( 


<View style={styles.container}>
{loader? <Loader /> : null }
<JobApp ref={childRef} />
        

        
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
        <View>
          <TextInput
          style={{ paddingHorizontal:10, paddingVertical:'2%', borderWidth:1, borderColor:'#ddd', borderRadius:20, marginBottom:10, marginTop:10 }}
          onChangeText={ value => { searchFilterFunction(value) } }
          placeholder="Search by Job Title"
          />
        </View>
        <Text style={{ fontSize:11 }}> {filteredDataSource.length} Available Jobs </Text>
        <FlatList

          data={filteredDataSource}
          keyExtractor={item => item.job_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={ () => play( item.id ) } key={item.id} style={styles.listItem}>
            
             
              <View style={styles.metaInfo}>
                <Text style={styles.title}><FontAwesome5 style={styles.iconstyle1} name="briefcase" /> {`${item.job_title}`}</Text>
                <Text style={{color:'#cc0000', fontSize:11, marginTop:-7}}> <Text style={{color:'#030121'}}>posted: </Text>{moment(item.date_created).utcOffset("+03:00") .format("dddd MMM Do")}   <Text style={{color:'#030121'}}>due: </Text>{moment(item.due_date).utcOffset("+03:00") .format("dddd MMM Do")}  </Text> 
                <Text style={styles.details}>{` ${item.job_company.initials }         ${item.job_type.type_name }          ${item.town.town_name }   `}</Text>   
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

    );
    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding:15
    },
    card: {
      fontSize: 25,
      color: '#101010',
      marginTop: 10,
      fontWeight: '700'
    },
    text: {
      fontSize: 20,
      color: '#101010',
      marginTop: 20,
      fontWeight: '700'
    },
    dropdown: {
      fontSize: 20,
      padding: 5,
      marginVertical: 5,
      borderRadius: 20,
      paddingHorizontal: 30,
    },
    listItem: {
      marginTop: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
      borderRadius: 15
    },
    listcat: {
      marginTop: 10,
      paddingVertical: 5,
      paddingHorizontal: 25,
      backgroundColor: '#fff',
      borderRadius: 15
    },
    coverImage: {
      width: 60,
      height: 20,
      borderRadius: 8
    },
    title: {
      fontSize: 15,
      padding: 10,
      fontWeight: '500'
    } ,
    details: {
      fontSize: 12,
      padding: 5
    } 
  });
