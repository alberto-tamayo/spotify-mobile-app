import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env'; //I used this to hide client id and client secret.
//also used .env and .gitignore before to hide your client id and client secret before you push it!

// Spotify API credentials
const CLIENT_ID = SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // This code is pasted from Spotify Dashboard. Fol 
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        params: { grant_type: 'client_credentials' },
      });
      setAccessToken(response.data.access_token); 
    } catch (error) {
      console.error('Error fetching access token:', error.message);
    }
  };

  // fetching all results we could find
  const fetchSearchResults = async () => {
    if (!accessToken || !query) return;

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'album,artist,playlist',
          limit: 10,
        },
      }); 
      //will return either found data or just empty array (no info to show)     
      const albums = response.data.albums?.items || [];
      const artists = response.data.artists?.items || [];
      const playlists = response.data.playlists?.items || [];

      setResults([...albums, ...artists, ...playlists].filter((item) => item && item.id)); 
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };

  // Fetch access token on mount
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search artists, albums, playlists"
        placeholderTextColor="#b3b3b3"
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={fetchSearchResults} 
      />

      {/* Search Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            {item.images && item.images[0]?.url && (
              <Image source={{ uri: item.images[0].url }} style={styles.resultImage} />
            )}
            <Text style={styles.resultText}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  searchBar: {
    height: 50,
    backgroundColor: '#1c1c1c',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
  },
});
