/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Progress from 'react-native-progress';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const scrollThreshold = 10;
  let scrollY = 0;

  const handleLoadStart = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    setProgress(100);
  };

  const handleLoadProgress = ({nativeEvent}) => {
    const newProgress = nativeEvent.progress * 100;
    setProgress(newProgress);
  };
  const handleReload = () => {
    if (isConnected) {
      webViewRef.reload();
    }
  };

  const handleScroll = syntheticEvent => {
    const {contentOffset} = syntheticEvent.nativeEvent;
    if (
      contentOffset.y <= 0 &&
      contentOffset.y <= scrollY.y &&
      scrollY.y !== 0
    ) {
      webViewRef.current.reload();
    }
    scrollY = contentOffset;
  };

  // Subscribe
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        {isLoading && (
          <Progress.Bar
            progress={progress}
            width={null}
            borderRadius={0}
            height={2}
            color={'rgb(43, 55, 84)'}
          />
        )}

        {!isConnected && (
          <View style={styles.content}>
            <Image style={styles.image} source={require('./img/No_wifi.png')} />
          </View>
        )}

        {isConnected && (
          <WebView
            ref={webViewRef}
            source={{uri: 'https://www.parrotias.com/'}}
            style={styles.webView}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onLoadProgress={handleLoadProgress}
            onError={handleReload}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '70%',
    height: '70%',
  },
});

export default App;
