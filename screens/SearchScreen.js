import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import axios from 'axios';

// Spotify API credentials
const CLIENT_ID = 'd6b82abe11344c6c8c11b05d894e6386';
const CLIENT_SECRET = '08661ac108fc4ea7a673509c77036c35';

const SearchScreen = () => {
  // State to store the search query input by the user
  const [query, setQuery] = useState('');
  // State to store search results (albums, artists, and playlists)
  const [results, setResults] = useState([]);
  // State to store the Spotify access token
  const [accessToken, setAccessToken] = useState('');

  /*
    Fetch Access Token:
    - Retrieves the access token required for making Spotify API requests.
    - The token is fetched using Spotify's 'Client Credentials Flow'.
  */
  const fetchAccessToken = async () => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`, // Encode credentials in Base64
        },
        params: { grant_type: 'client_credentials' }, // Required for the flow
      });
      setAccessToken(response.data.access_token); // Save the token to state
    } catch (error) {
      console.error('Error fetching access token:', error.message);
    }
  };

  /*
    Fetch Search Results:
    - Sends a GET request to Spotify's Search API with the user's query.
    - Fetches results of type 'album', 'artist', and 'playlist' with a limit of 10.
    - Combines the results into a single array and filters out any invalid entries.
  */
  const fetchSearchResults = async () => {
    if (!accessToken || !query) return; // Exit if no token or query

    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Attach the access token to the request
        },
        params: {
          q: query, // The search query input
          type: 'album,artist,playlist', // Search across albums, artists, and playlists
          limit: 10, // Limit results to 10 items per category
        },
      });

      // Extract data from the API response or set an empty array if not available
      const albums = response.data.albums?.items || [];
      const artists = response.data.artists?.items || [];
      const playlists = response.data.playlists?.items || [];

      // Combine albums, artists, and playlists into a single array
      // Filter out items that are undefined or missing an 'id'
      setResults([...albums, ...artists, ...playlists].filter((item) => item && item.id));
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };

  /*
    useEffect Hook:
    - Fetches the Spotify access token when the component mounts.
  */
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search artists, albums, playlists" // Placeholder text in the search bar
        placeholderTextColor="#b3b3b3"
        value={query} // Controlled input value
        onChangeText={(text) => setQuery(text)} // Update state when the user types
        onSubmitEditing={fetchSearchResults} // Trigger search when 'Enter' is pressed
      />

      {/* FlatList to Display Search Results */}
      <FlatList
        data={results} // Data array to render
        keyExtractor={(item) => item.id} // Unique key for each list item
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            {/* Display the first image if available */}
            {item.images && item.images[0]?.url && (
              <Image source={{ uri: item.images[0].url }} style={styles.resultImage} />
            )}
            {/* Display the name of the item (album, artist, or playlist) */}
            <Text style={styles.resultText}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

/* Styles (can be ignored as requested) */
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
