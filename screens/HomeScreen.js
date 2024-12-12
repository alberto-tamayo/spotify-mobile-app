import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import axios from 'axios';

// Spotify API credentials
const CLIENT_ID = 'd6b82abe11344c6c8c11b05d894e6386';
const CLIENT_SECRET = '08661ac108fc4ea7a673509c77036c35';

const HomeScreen = () => {
  // State variables to store access token and fetched data
  const [accessToken, setAccessToken] = useState(''); // Access token for Spotify API
  const [albums, setAlbums] = useState([]);           // New album releases
  const [categories, setCategories] = useState([]);   // Spotify categories (genres, moods)
  const [artists, setArtists] = useState([]);         // Popular artists
  
  // Tabs for navigation
  const TABS = ['All', 'Music', 'Podcasts', 'Audiobooks'];
  const [activeTab, setActiveTab] = useState('All'); // Tracks the currently active tab

  // Utility function to shorten long names
  const shortenName = (name, maxLength = 20) => {
    // If name exceeds maxLength, truncate and add '...'
    return name?.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  /* 
    Fetch Access Token:
    Makes a POST request to the Spotify API to retrieve an access token.
    This token is required for making subsequent authorized API requests.
  */
  const fetchAccessToken = async () => {
    try {
      console.log('Fetching Access Token...');
      const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`, // Encodes credentials
        },
        params: { grant_type: 'client_credentials' }, // Required parameter for client credentials flow
      });
      setAccessToken(response.data.access_token); // Save the token to state
    } catch (error) {
      console.error('Error fetching access token:', error.message);
    }
  };

  /* Runs once when the component is first rendered */
  useEffect(() => {
    fetchAccessToken();
  }, []);

  /*
    Fetch New Releases:
    Retrieves new albums from Spotify API and updates the 'albums' state.
  */
  const fetchNewReleases = async () => {
    try {
      console.log('Fetching New Releases...');
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAlbums(response.data.albums.items); // Save album data to state
    } catch (error) {
      console.error('Error fetching new releases:', error.message);
    }
  };

  /*
    Fetch Categories:
    Retrieves Spotify categories (like genres or moods) and updates the 'categories' state.
  */
  const fetchCategories = async () => {
    try {
      console.log('Fetching Spotify Categories...');
      const response = await axios.get('https://api.spotify.com/v1/browse/categories', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(response.data.categories.items); // Save categories data to state
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  /*
    Fetch Popular Artists:
    Fetches a predefined list of popular artists by their IDs using the Spotify API.
  */
  const fetchTopArtists = async () => {
    try {
      console.log('Fetching Popular Artists...');
      const artistIds = [
        '4YRxDV8wJFPHPTeXepOstw', // Arijit Singh
        '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
        '3TVXtAsR1Inumwj472S9r4', // Drake
        '3Nrfpe0tUJi4K4DXYWgMUX', // BTS
        '4dpARuHxo51G3z768sgnrY', // Adele
      ].join(',');

      const response = await axios.get('https://api.spotify.com/v1/artists', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { ids: artistIds },
      });
      setArtists(response.data.artists); // Save artist data to state
    } catch (error) {
      console.error('Error fetching artists:', error.message);
    }
  };

  /* Runs after the access token is successfully retrieved */
  useEffect(() => {
    if (accessToken) {
      fetchNewReleases();
      fetchCategories();
      fetchTopArtists();
    }
  }, [accessToken]); // Dependency: accessToken

  /*
    Render a single item in the FlatList.
    Dynamically determines which image to display and adjusts styling.
  */
  const renderItem = ({ item, section }) => {
    // Extracts the image URL:
    // - For albums/artists: 'images' array is checked.
    // - For categories: 'icons' array is checked.
    const imageUrl = item.images?.[0]?.url || item.icons?.[0]?.url;

    return (
      <View style={styles.item}>
        {/* Only render the image if an imageUrl is available */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }} // Load image from URL
            style={section === 'artists' ? styles.artistImage : styles.image} // Conditional styling for artists
          />
        )}
        {/* Display the name, shortened if necessary */}
        <Text style={styles.name}>{shortenName(item.name)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tab}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Spotify Categories */}
      <Text style={styles.sectionTitle}>Spotify Categories</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => renderItem({ item, section: 'categories' })}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Popular Artists */}
      <Text style={styles.sectionTitle}>Popular Artists</Text>
      <FlatList
        data={artists}
        renderItem={({ item }) => renderItem({ item, section: 'artists' })}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      {/* Popular Albums */}
      <Text style={styles.sectionTitle}>Popular Albums</Text>
      <FlatList
        data={albums}
        renderItem={({ item }) => renderItem({ item, section: 'albums' })}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;
