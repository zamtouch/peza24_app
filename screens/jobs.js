import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Image, ImageBackground, FlatList, ScrollView, TouchableOpacity,TextInput, Component } from 'react-native';
import moment from "moment";
import { Ionicons, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import filter from 'lodash.filter';
//import DropDownPicker from 'react-native-dropdown-picker';
//import Dropdown from './components/Dropdown';

export default function Profile() {

  //dropdown
  const [category_name, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategory] = useState([]);
  //search 
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  //jobs
  const [jobs, setJobs] = useState([]);

  //fetch data from api
  const get_jobs = () => {
    Promise.all([
      fetch(
        "https://cms.peza24.com/items/job_listings?limit=10&fields=*.*.*&sort=-date_created"
      ).then((resp) => resp.json()),
      fetch(
        "https://cms.peza24.com/items/job_categories?limit=20&fields=*.*.*"
      ).then((resp) => resp.json())
    ])
      .then(function (response) {

        /*setTimeout(function() {
          setLoader(false);
        }, 1000);*/
        
        setJobs(response[0].data);
        setData(response[0].data);
        setCategory(response[1].data);
        setValue(response[1].data);


      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  React.useEffect(() => {
    get_jobs();
  },[]) 

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

  // Search Handler
  const handleSearch = text => {
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(jobs, job => {
      return contains(job, formattedQuery);
    });
    setData(filteredData);
    setQuery(text);
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

  
        <Text style={styles.text}>Available Jobs</Text>
        
        <FlatList

        ListHeaderComponent={renderHeader}
          data={data}
          keyExtractor={item => item.job_id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image
              source={{ uri: 'https://peza24.com/img/logos/peza24.png' }}
                style={styles.coverImage}
            />
              <View style={styles.metaInfo}>
                <Text style={styles.title}>{`${item.job_title}`} <Text style={{color:'red'}}> {item.due_date }    </Text> </Text>
                <Text style={styles.details}>{` ${item.job_company.initials }         ${item.job_type.type_name }          ${item.town.town_name }   `}</Text>   
              </View>
            </View>
          )}
        />
      </View>

    );
    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
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
    listItem: {
      marginTop: 10,
      paddingVertical: 5,
      paddingHorizontal: 25,
      backgroundColor: '#fff',
      flexDirection: 'row',
      borderRadius: 15
    },
    listcat: {
      marginTop: 10,
      paddingVertical: 5,
      paddingHorizontal: 25,
      backgroundColor: '#fff',
      borderRadius: 15
    },
    metaInfo: {
      marginLeft: 10
    },
    coverImage: {
      width: 60,
      height: 20,
      borderRadius: 8
    },
    title: {
      fontSize: 15,
      width: 200,
      padding: 10,
      fontWeight: '500'
    } ,
    details: {
      fontSize: 10,
      width: 200,
      padding: 5
    } 
  });
