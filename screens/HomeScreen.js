import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from 'react-native';
import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env'; //I used this to hide client id and client secret.
//also used .env and .gitignore before to hide your client id and client secret before you push it!

const CLIENT_ID = SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;

const HomeScreen = () => {
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [artists, setArtists] = useState([]);

  const TABS = ['All', 'Music', 'Podcasts', 'Audiobooks'];
  const [activeTab, setActiveTab] = useState('All');

  const shortenName = (name, maxLength = 20) => {
    return name?.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  // Fetch Access Token
  const fetchAccessToken = async () => {
    try {
      console.log('Fetching Access Token...');
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

  // Fetch New Releases (Popular Albums)
  const fetchNewReleases = async () => {
    try {
      console.log('Fetching New Releases...');
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAlbums(response.data.albums.items);
    } catch (error) {
      console.error('Error fetching new releases:', error.message);
    }
  };

  // Fetch Categories (Spotify Categories)
  const fetchCategories = async () => {
    try {
      console.log('Fetching Spotify Categories...');
      const response = await axios.get('https://api.spotify.com/v1/browse/categories', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(response.data.categories.items);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  // fetching popular artists from spotify dashboard. 
  const fetchTopArtists = async () => {
    try {
      console.log('Fetching Popular Artists...');
      const artistIds = [
        '4YRxDV8wJFPHPTeXepOstw', // Arijit Singh
        '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
        '3TVXtAsR1Inumwj472S9r4', // Drake
        '3Nrfpe0tUJi4K4DXYWgMUX', // BTS
        '4dpARuHxo51G3z768sgnrY', // Adele
        '1uNFoZAHBGtllmzznpCI3s', // Justin Bieber
        '66CXWjxzNUsdJxJ2JdwvnR', // Ariana Grande
        '0du5cEVh5yTK9QJze8zA0C', // Bruno Mars
        '6eUKZXaKkcviH0Ku9w2n3V', // Ed Sheeran
        '7dGJo4pcD2V6oG8kP0tJRR', // Eminem
        '6qqNVTkY8uBg9cP3Jd7DAH', // Billie Eilish
      ].join(',');

      const response = await axios.get('https://api.spotify.com/v1/artists', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { ids: artistIds },
      });

      setArtists(response.data.artists);
    } catch (error) {
      console.error('Error fetching artists:', error.message);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchNewReleases();
      fetchCategories();
      fetchTopArtists();
    }
  }, [accessToken]);

  const renderItem = ({ item, section }) => {
    const imageUrl = item.images?.[0]?.url || item.icons?.[0]?.url;

    return (
      <View style={styles.item}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={section === 'artists' ? styles.artistImage : styles.image}
          />
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    padding: 8,
  },
  tabText: {
    color: '#b3b3b3',
    fontSize: 16,
  },
  activeTabText: {
    color: '#1DB954',
    borderBottomWidth: 2,
    borderBottomColor: '#1DB954',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10,
  },
  item: {
    marginRight: 15,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});
