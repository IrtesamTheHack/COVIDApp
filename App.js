import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SearchBar, ListItem} from 'react-native-elements';
const countries = require('./countries.json');

const Start = ({navigation}) => {
  const [ready, setReady] = useState(false);
  const [countries, setCountries] = useState(null);
  const [value, setValue] = useState('');
  function searchFilterFunction(text) {
    setValue(text);
    if (text === '') {
      fetch('https://api.covid19api.com/countries', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => {
          setCountries(json);
        });
      return;
    }
    const newData = countries.filter(item => {
      const query = `${text.toLowerCase()}`;
      return item.Slug.indexOf(query) > -1;
    });
    setCountries(newData);
  }

  function renderHeader() {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => searchFilterFunction(text)}
        autoCorrect={false}
        value={value}
      />
    );
  }

  useEffect(() => {
    if (countries === null) {
      fetch('https://api.covid19api.com/countries', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => {
          setCountries(json);
        })
        .finally(() => setReady(true));
    }
  });

  if (ready) {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={countries}
          renderItem={({item}) => (
            <ListItem
              title={item.Country}
              containerStyle={{borderBottomWidth: 0}}
              onPress={() =>
                navigation.navigate('Country Details', {
                  country: item.Country,
                  slug: item.Slug,
                })
              }
            />
          )}
          keyExtractor={item => item.Slug}
          ListHeaderComponent={renderHeader()}
        />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
};

const Details = ({route}) => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://api.covid19api.com/dayone/country/${route.params.slug}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setData(json);
      })
      .finally(() => setReady(true));
  });

  if (ready) {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.header}>{route.params.country}</Text>
              <Text style={styles.sectionDescription}>
                All Day One COVID-19 statistics below:
              </Text>
              <Text style={styles.sectionTitle}>Day One Statistics</Text>
              <Text style={styles.sectionDescription}>
                Date of first case: {data[0].Date.split('T')[0]}
              </Text>
              <Text style={styles.sectionDescription}>
                Number of first day cases: {data[0].Confirmed}
              </Text>
              <Text style={styles.sectionDescription}>
                Day one cases still active: {data[0].Active}
              </Text>
              <Text style={styles.sectionTitle}>Current Statistics</Text>
              <Text style={styles.sectionDescription}>
                Confirmed cases: {data[data.length - 1].Confirmed}
              </Text>
              <Text style={styles.sectionDescription}>
                Active cases: {data[data.length - 1].Active}
              </Text>
              <Text style={styles.sectionDescription}>
                Total Recovered: {data[data.length - 1].Recovered}
              </Text>
              <Text style={styles.sectionDescription}>
                Total Deaths: {data[data.length - 1].Deaths}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
};

const Global = () => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.covid19api.com/summary', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setData(json);
      })
      .finally(() => setReady(true));
  });

  if (ready) {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.header}>Global COVID-19 Statistics</Text>
              <Text style={styles.sectionDescription}>
                All Global COVID-19 statistics below:
              </Text>
              <Text style={styles.sectionDescription}>
                New Confirmed Cases: {data.Global.NewConfirmed}
              </Text>
              <Text style={styles.sectionDescription}>
                Total Confirmed Cases: {data.Global.TotalConfirmed}
              </Text>
              <Text style={styles.sectionDescription}>
                New Deaths: {data.Global.NewDeaths}
              </Text>
              <Text style={styles.sectionDescription}>
                Total Deaths: {data.Global.TotalDeaths}
              </Text>
              <Text style={styles.sectionDescription}>
                New Recovered Cases: {data.Global.NewRecovered}
              </Text>
              <Text style={styles.sectionDescription}>
                Total Recovered Cases: {data.Global.TotalRecovered}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
};

const Country = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Country Selection" component={Start} />
      <Stack.Screen name="Country Details" component={Details} />
    </Stack.Navigator>
  );
};

const RegionDisplay = ({route}) => {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState(null);

  function createStats() {
    const jsx = [];
    data.forEach((country, index) => {
      jsx.push(
        <View key={index}>
          <Text style={styles.sectionTitle}>{country.Country}</Text>
          <Text style={styles.sectionDescription}>
            New Confirmed Cases: {country.NewConfirmed}
          </Text>
          <Text style={styles.sectionDescription}>
            Total Confirmed Cases: {country.TotalConfirmed}
          </Text>
          <Text style={styles.sectionDescription}>
            New Deaths: {country.NewDeaths}
          </Text>
          <Text style={styles.sectionDescription}>
            Total Deaths: {country.TotalDeaths}
          </Text>
          <Text style={styles.sectionDescription}>
            New Recovered Cases: {country.NewRecovered}
          </Text>
          <Text style={styles.sectionDescription}>
            Total Recovered Cases: {country.TotalRecovered}
          </Text>
        </View>,
      );
    });
    return jsx;
  }

  useEffect(() => {
    fetch('https://api.covid19api.com/summary', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setData(
          json.Countries.filter(country => {
            const found = countries.find(
              aCountry => aCountry.country === country.Country,
            );
            if (!found) {
              return false;
            } else if (route.name !== found.continent) {
              return false;
            } else {
              return true;
            }
          }),
        );
      })
      .finally(() => setReady(true));
  });

  if (ready) {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.header}>Statistics for {route.name}</Text>
              {createStats()}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
};

const AllCountries = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Europe" component={RegionDisplay} />
      <Tab.Screen name="North America" component={RegionDisplay} />
      <Tab.Screen name="South America" component={RegionDisplay} />
      <Tab.Screen name="Asia" component={RegionDisplay} />
      <Tab.Screen name="Africa" component={RegionDisplay} />
      <Tab.Screen name="Oceania" component={RegionDisplay} />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Country Details" component={Country} />
        <Drawer.Screen name="Global Summary" component={Global} />
        <Drawer.Screen name="Regional Statistics" component={AllCountries} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'hsl(0, 0%, 96%)',
  },
  body: {
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0a0a0a',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0a0a0a',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#363636',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
