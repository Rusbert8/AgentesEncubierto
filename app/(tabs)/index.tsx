// Rusbert Antonelly Sánchez Rosario (2022-0323)
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const [fecha, setFecha] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [eventos, setEventos] = useState<any[]>([]);
  const [alert, setAlert] = useState<boolean>(false);

  const insertarEvento = async () => {
    try {
      const newEvent = {
        id: Date.now().toString(),
        fecha,
        titulo,
        descripcion,
        foto,
      };

      const updateEvents = [...eventos, newEvent];
      await AsyncStorage.setItem("eventos", JSON.stringify(updateEvents));
      setEventos(updateEvents);
      console.log("Evento insertado exitosamente.");
      limpiarCampos();
      setAlert(true);
    } catch (error) {
      console.error("Error insertando evento: ", error);
    }
  };

  async function seleccionarFoto() {
    const fotoSeleccionada = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });
    console.log(fotoSeleccionada);
    if (!fotoSeleccionada.canceled) {
      setFoto(fotoSeleccionada.assets[0].uri);
    }
  }

  const limpiarCampos = () => {
    setFecha("");
    setTitulo("");
    setDescripcion("");
    setFoto(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Eventos</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        style={styles.input}
        placeholder="Titulo"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {foto ? <Image source={{ uri: foto }} style={styles.image} /> : null}
      <TouchableOpacity onPress={seleccionarFoto} style={styles.btnImage}>
        <Text style={styles.btnText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={insertarEvento} style={styles.btn}>
        <Text style={styles.btnText}>Registrar Evento</Text>
      </TouchableOpacity>
      {alert == true && <Text style={styles.alert}>Evento Registrado</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "#2f6682",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "80%",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    paddingTop: 10,
  },
  btn: {
    backgroundColor: "#2f6682",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  btnImage: {
    backgroundColor: "#676a6e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
  },
  alert: {
    marginTop: 16,
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
});
