import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CustomDrawerContent(
  props: DrawerContentComponentProps
) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.toggleDrawer()}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DI</Text>
        </View>
        <Text style={styles.name}>Diego Ibarra</Text>
        <Text style={styles.role}>Desarrollador</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.actions}>
        <Text style={styles.actionsTitle}>Acciones rápidas</Text>
        <DrawerItem
          label="Ir al inicio"
          onPress={() =>
            props.navigation.navigate("Inicio", {
              screen: "HomeTabs",
              params: { screen: "Home" },
            })
          }
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#7700a5",
    position: "relative",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
    padding: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3f204f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  name: {
    color: "#ddb00c",
    fontStyle: "italic",
    fontSize: 19,
    fontWeight: "700",
  },
  role: {
    color: "#fff",
    marginTop: 2,
  },
  menu: {
    marginTop: 8,
  },
  actions: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  actionsTitle: {
    fontWeight: "700",
    color: "#505050",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
});
