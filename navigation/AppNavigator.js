import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer} from "@react-navigation/native";
import Dashboard from "../screens/Dashboard"
import StudentList from "../screens/StudentList";
import StudentDetails from "../screens/StudentDetails";
import GradeDistribution from "../screens/GradeDistribution";
import AddStudent from "../screens/AddStudent"

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Dashboard">
                <Stack.Screen name="AddStudent" component={AddStudent} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="StudentList" component={StudentList} />
                <Stack.Screen name="StudentDetails" component={StudentDetails} />
                <Stack.Screen name="GradeDistribution" component={GradeDistribution}  />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;