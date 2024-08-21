import { Stack } from "expo-router";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { icons } from "../../constants";

interface ITabIconProps {
  icon?: ImageSourcePropType;
  color?: string;
  name?: string;
  focuesd?: boolean;
}

const TabICon = ({ icon, color, name, focuesd }: ITabIconProps) => (
  <View className="items-center justify-center gap-2">
    <Image
      source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-6 h-6"
    />
    <Text
      className={`${focuesd ? "font-psemibold" : "font-pregular text-xs"}`}
      style={{ color }}
    >
      {name}
    </Text>
  </View>
);

const TabsLayout = () => {
  const data = [
    { name: "home", title: "Home", icon: icons.home },
    { name: "bookmark", title: "bookmark", icon: icons.bookmark },
    { name: "create", title: "create", icon: icons.plus },
    { name: "profile", title: "profile", icon: icons.profile },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        {data.map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              title: item.title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabICon
                  icon={item.icon}
                  color={color}
                  focuesd={focused}
                  name={item.name}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

export default TabsLayout;
