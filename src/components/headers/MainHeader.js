import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import Style from '../../utils/Style';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function MainHeader({ searchQuery, setSearchQuery }) {
  const navigation = useNavigation();
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleDrawer = () => {
    navigation.toggleDrawer();
    setMenuToggle(!menuToggle); // Toggle the menu state
  };

  return (
    <View>
      <View style={Style.Header}>
        {/* Menu view */}
        <View style={{ width: '10%', alignItems: 'center' }}>
          <Icon
            name="menu"
            size={28}
            color={Colors.GRAY}
            onPress={toggleDrawer} // Call toggleDrawer function onPress
          />
        </View>
        {/* Search view */}
        <View style={[Style.search, { width: '82%', marginHorizontal: '4%' }]}>
          <Icon name="search" size={22} color={Colors.BLACK} />
          <TextInput
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              backgroundColor: Colors.TRANSPARENT,
              color: Colors.BLACK,
              width: '83%',
              paddingLeft: 5,
              fontSize: 15,
            }}
            placeholderTextColor={Colors.GRAY}
            value={searchQuery}
            onChangeText={query => {
              setSearchQuery(query);
            }}
          />
          {searchQuery !== '' && (
            <Icon
              name="highlight-remove"
              size={22}
              onPress={() => {
                setSearchQuery('');
              }}
              color={Colors.BLACK}
            />
          )}
        </View>
      </View>
    </View>
  );
}
