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
import {showError} from '../../../HelperFunctions';
import WapperContainer from '../../component/WapperContainer';
import LoadingScreen from '../../component/Loader';

const Home = () => {
  const [location, setLocation] = useState('bhilwara');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [weatherIcon, setWeatherIcon] = useState(null);

  useEffect(() => {
    handleweatherData();
  }, []);
  const handleweatherData = async () => {
    if (!location) {
      showError('Please Enter location');
      return;
    }
    try {
      isLoading ? setLoading(true) : setLoadingBtn(true);
      const url = `${API_BASE_URL}weather?q=${location}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const currentWeatherData = await response.json();
      if (!currentWeatherData || currentWeatherData.cod !== 200) {
        showError('Please enter a valid location.');
        setLoadingBtn(false);
        return;
      }
      setCurrentWeather(currentWeatherData);

      const forecastResponse = await fetch(
        `${API_BASE_URL}forecast?q=${location}&appid=${API_KEY}&units=metric`,
      );
      const forecastData = await forecastResponse.json();
      const today = new Date().getDate();
      const nextTwoDaysForecast = [];
      let currentDay = today;
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).getDate();
        if (date !== currentDay) {
          nextTwoDaysForecast.push(item);
          currentDay = date;
        }
      });
      if (currentWeatherData.weather.length > 0 && currentWeatherData) {
        const iconCode = currentWeatherData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        setWeatherIcon(iconUrl);
      }
      setForecast(nextTwoDaysForecast);
      setLoadingBtn(false);
      setLoading(false);
      console.log(isLoading);
    } catch (error) {
      showError('please enter valide input');
      setLoadingBtn(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <WapperContainer>
      <Image
        source={ImagePath.BACKGROND_IMG}
        style={{
          width: spacing.FULL_WIDTH,
          height: spacing.FULL_HEIGHT,
        }}
      />
      <View style={styles.container}>
        <TextImputComp
          value={location}
          onChangeText={setLocation}
          placeholder={'Enter Location'}
          RightImg={ImagePath.IC_SEARCH}
          inputStyle={{backgroundColor: '#383939'}}
        />
        <View style={styles.mainContainer}>
          <View style={styles.weatherCodeStyle}>
            {currentWeather && (
              <Image
                source={{uri: weatherIcon}}
                style={{
                  width: spacing.WIDTH_110,
                  height: spacing.HEIGHT_110,
                }}
              />
            )}
            {forecast.length > 0 && (
              <TextComp
                text={`${currentWeather?.main?.temp.toFixed(0)}°C`}
                style={styles.tempTextStyle}
              />
            )}
            {currentWeather && (
              <TextComp
                text={currentWeather?.name}
                style={styles.locationTextStyle}
              />
            )}
            {currentWeather && (
              <TextComp
                text={currentWeather?.weather[0]?.main}
                style={{
                  fontSize: textScale(22),
                }}
              />
            )}
            <TextComp
              text={`Today ${new Date().getDate()} ${new Date().toLocaleString(
                'default',
                {
                  month: 'long',
                },
              )}`}
            />
          </View>
        </View>
        <FlatList
          data={forecast}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View style={styles.forcastContainerStyle}>
                {currentWeather && (
                  <Image
                    source={{uri: weatherIcon}}
                    style={{
                      width: spacing.WIDTH_70,
                      height: spacing.HEIGHT_70,
                      marginTop: -spacing.MARGIN_20,
                    }}
                  />
                )}
                {forecast.length > 0 && (
                  <TextComp>
                    {new Date(item?.dt * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                    })}
                    : {item?.main?.temp.toFixed(0)}°C
                  </TextComp>
                )}
              </View>
            );
          }}
        />
        <BottonComp
          text="search"
          textStyle={{fontSize: textScale(18)}}
          onPress={handleweatherData}
          isLoading={isLoadingBtn}
        />
      </View>
    </WapperContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    margin: spacing.PADDING_20,
    padding: spacing.PADDING_10,
    width: '90%',
    borderRadius: spacing.RADIUS_12,
    marginTop: -spacing.MARGIN_30,
    position: 'absolute',
    top: spacing.HEIGHT_90,
  },
  mainContainer: {
    height: spacing.HEIGHT_350,
    borderRadius: spacing.RADIUS_12,
    backgroundColor: '#2a2a2a',
    elevation: 2,
  },
  locationTextStyle: {
    paddingTop: spacing.PADDING_16,
    paddingHorizontal: spacing.PADDING_16,
    fontSize: textScale(26),
  },
  tempTextStyle: {
    fontSize: textScale(38),
  },
  weatherCodeStyle: {
    alignItems: 'center',
  },
  secondHeadingContainer: {
    height: spacing.HEIGHT_34,
    backgroundColor: '#ACAFB1',
    borderRadius: spacing.RADIUS_12,
    marginVertical: spacing.MARGIN_12,
    elevation: 2,
  },
  forcastContainerStyle: {
    width: spacing.WIDTH_134,
    height: spacing.HEIGHT_136,
    backgroundColor: '#2a2a2a',
    borderRadius: spacing.RADIUS_12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.MARGIN_10,
    marginVertical: spacing.MARGIN_10,
    elevation: 2,
  },
});
