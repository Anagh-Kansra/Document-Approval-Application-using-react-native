import React from 'react';
import { View, Image, TextInput, TouchableOpacity } from 'react-native';
import Style from '../../utils/Style';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SidePanel from './SidePanel';

export default function Header({ searchQuery, setSearchQuery, toggleMenu }) {
  return (
    <View>
      <View style={Style.Header}>
        <View style={{ width: '10%', alignItems: 'center' }}>
          <Icon
            name="menu"
            size={28}
            color={Colors.GRAY}
            onPress={toggleMenu} // Call the toggleMenu function when the menu button is pressed
          />
        </View>
        <View style={{ width: '40%' }}>
          <Image
            source={Images.LOGOS.SLOGO}
            style={{ width: '75%', height: '100%' }}
          />
        </View>
        <View style={[Style.search, { width: '50%' }]}>
          <Icon name="search" size={22} color={Colors.BLACK} />
          <TextInput
            placeholder="Search"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              backgroundColor: Colors.TRANSPARENT,
              color: Colors.BLACK,
              width: '75%',
              paddingLeft: 5,
              fontSize: 15,
            }}
            placeholderTextColor={Colors.GRAY}
            value={searchQuery}
            onChangeText={query => {
              setSearchQuery(query);
            }}
          />
          {searchQuery != '' ? (
            <Icon
              name="highlight-remove"
              size={22}
              onPress={() => {
                setSearchQuery('');
              }}
              color={Colors.BLACK}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}
