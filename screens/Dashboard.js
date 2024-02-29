import React from "react";
import { View, Text, Button} from "react-native";

const Dashboard = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Dashboard</Text>
            <Button title="View Students" onPress={() => navigation.navigate('StudentList')} />
            <Button title="Grade Distribution" onPress={() => navigation.navigate('GradeDistribution')} />
        </View>
    );
};

export default Dashboard;
