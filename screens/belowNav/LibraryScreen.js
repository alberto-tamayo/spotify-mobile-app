import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LibraryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Library Screen</Text>
    </View>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
