import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer} from "@react-navigation/native";
import Dashboard from "../screens/Dashboard"
import GradeDistribution from "../screens/GradeDistribution";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Dashboard">
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="GradeDistribution" component={GradeDistribution}  />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;