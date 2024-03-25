import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {API_BASE_URL, API_KEY} from '../../API/Apis';
import {spacing} from '../../styles/spacing';
import TextImputComp from '../../component/TextImputComp';
import TextComp from '../../component/TextComp';
import {textScale} from '../../styles/responsiveStyles';
import BottonComp from '../../component/BottonComp';
import ImagePath from '../../Utills/ImagePath';
import LoadingScreen from '../../component/Loader';
import { showError } from '../../../HelperFunctions';

const Home = () => {
  const [location, setLocation] = useState('bhilwara');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    handleweatherData();
  }, []);
  const handleweatherData = async () => {
    if(location == ''){
      showError('Please Enter location')
      return;
    }
    try {
      setLoading(true);
      const url = `${API_BASE_URL}weather?q=${location}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const currentWeatherData = await response.json();

      setCurrentWeather(currentWeatherData);

      const forecastResponse = await fetch(
        `${API_BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=metric`,
      );
      const forecastData = await forecastResponse.json();
      // console.log(forecastData);
      const today = new Date().getDate();
      const forecastList = forecastData.list.filter(item => {
        const itemDate = new Date(item.dt * 1000).getDate();
        return itemDate !== today && itemDate < today + 3;
      });
      setLoading(false);
      setForecast(forecastList);
    } catch (error) {
      showError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather data:', error);
    }
  };
  const getWeatherIcon = weatherCode => {
    switch (weatherCode) {
      case 'Clear':
        return ImagePath.IC_SUN;
      case 'Clouds':
        return ImagePath.IC_CLOUD;
      case 'Rain':
        return ImagePath.IC_CLOUD_RAIN;
      case 'Thunderstorm':
        return ImagePath.IC_CLOUD_LIGHTNING;
      case 'Snow':
        return ImagePath.IC_CLOUD_SNOW;
      case 'Haze':
        return ImagePath.IC_HAZE;
      default:
        return ImagePath.IC_HELP_CIRCLE;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  // console.log(currentWeather?.weather[0]?.main);
  return (
    <View style={{flex: 1, backgroundColor: '#B9CFD6'}}>
      <TouchableOpacity
        style={{margin: spacing.PADDING_16}}
        onPress={handleweatherData} >
        <Image source={ImagePath.IC_REFRESH} style={{alignSelf: 'flex-end'}} />
      </TouchableOpacity>
      <View style={styles.container}>
        <TextImputComp
          value={location}
          onChangeText={setLocation}
          placeholder={'Enter Location'}
          RightImg={ImagePath.IC_SEARCH}
        />
        <View style={styles.firstHeadingContainer}>
          <TextComp
            text={`Todat's Weather`}
            style={{
              paddingTop: spacing.PADDING_6,
              paddingHorizontal: spacing.PADDING_10,
            }}
          />
        </View>
        <View style={styles.mainContainer}>
          <View style={{justifyContent: 'flex-start'}}>
            {currentWeather && (
              <TextComp
                text={currentWeather?.name}
                style={styles.locationTextStyle}
              />
            )}

            {forecast.length > 0 && (
              <TextComp
                text={`${currentWeather?.main?.temp}°C`}
                style={styles.tempTextStyle}
              />
            )}
          </View>
          <View style={styles.weatherCodeStyle}>
            <Image
              source={getWeatherIcon(currentWeather?.weather[0]?.main)}
              style={{width: spacing.WIDTH_50, height: spacing.HEIGHT_50}}
            />
            <TextComp
              text={currentWeather?.weather[0]?.main}
              style={{
                fontSize: textScale(22),
              }}
            />
          </View>
        </View>

        <View style={styles.secondHeadingContainer}>
          <TextComp
            text={`Weather Next for Two Days`}
            style={styles.secondHeadingTextStyle}
          />
        </View>
        <FlatList
          data={forecast}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View style={styles.forcastContainerStyle}>
                <Image
                  source={getWeatherIcon(currentWeather?.weather[0]?.main)}
                  style={{width: spacing.WIDTH_50, height: spacing.HEIGHT_50}}
                />
                <Text>
                  {new Date(item?.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                  })}
                  : {item?.main?.temp}°C
                </Text>
              </View>
            );
          }}
        />
        <BottonComp
          text="search"
          textStyle={{fontSize: textScale(18)}}
          onPress={handleweatherData}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.PADDING_20,
    paddingVertical: spacing.PADDING_68,
  },
  mainContainer: {
    height: spacing.HEIGHT_150,
    width: spacing.WIDTH_338,
    borderRadius: spacing.RADIUS_12,
    backgroundColor: '#ACAFB1',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstHeadingContainer: {
    height: spacing.HEIGHT_34,
    backgroundColor: '#ACAFB1',
    borderRadius: spacing.RADIUS_12,
    marginVertical: spacing.MARGIN_12,
  },
  locationTextStyle: {
    paddingTop: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_16,
    fontSize: textScale(26),
  },
  tempTextStyle: {
    paddingHorizontal: spacing.PADDING_16,
    fontSize: textScale(40),
  },
  weatherCodeStyle: {
    alignItems: 'center',
    paddingTop: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_16,
  },
  secondHeadingContainer: {
    height: spacing.HEIGHT_34,
    backgroundColor: '#ACAFB1',
    borderRadius: spacing.RADIUS_12,
    marginVertical: spacing.MARGIN_12,
  },
  secondHeadingTextStyle: {
    paddingTop: spacing.PADDING_6,
    paddingHorizontal: spacing.PADDING_10,
  },
  forcastContainerStyle: {
    width: spacing.WIDTH_116,
    height: spacing.HEIGHT_105,
    backgroundColor: '#ACAFB1',
    borderRadius: spacing.RADIUS_12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.MARGIN_10,
  },
});
