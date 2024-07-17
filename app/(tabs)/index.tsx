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
import { Audio } from "expo-av";

export default function HomeScreen() {
  const [fecha, setFecha] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [foto, setFoto] = useState<string | undefined>(undefined);
  const [audio, setAudio] = useState<string | undefined>(undefined);
  const [incidencias, setIncidencias] = useState<any[]>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const insertarIncidencia = async () => {
    if (!fecha || !titulo || !descripcion || !foto || !audio) {
      Alert.alert("Campos Vacíos", "Por favor completa todos los campos.");
      return;
    }
    try {
      const newEvent = {
        id: Date.now().toString(),
        fecha,
        titulo,
        descripcion,
        foto,
        audio,
      };

      const updateEvents = [...incidencias, newEvent];
      await AsyncStorage.setItem("incidencias", JSON.stringify(updateEvents));
      setIncidencias(updateEvents);
      console.log("Incidencia insertada exitosamente.");
      limpiarCampos();
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);
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

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      console.log("Stopping recording..");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setAudio(uri);
      }
      setRecording(null);
      console.log("Recording stopped and stored at", uri);
    }
  };

  const limpiarCampos = () => {
    setFecha("");
    setTitulo("");
    setDescripcion("");
    setFoto(undefined);
    setAudio(undefined);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Incidencias</Text>
      <TextInput
        style={styles.input}
        placeholder="Titulo"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha"
        value={fecha}
        onChangeText={setFecha}
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

      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        style={styles.btn}
      >
        <Text style={styles.btnText}>
          {recording ? "Detener Grabación" : "Grabar Audio"}
        </Text>
      </TouchableOpacity>

      {audio && (
        <TouchableOpacity
          onPress={async () => {
            const sound = new Audio.Sound();
            await sound.loadAsync({ uri: audio });
            await sound.playAsync();
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Reproducir Audio</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={insertarIncidencia} style={styles.btn}>
        <Text style={styles.btnText}>Registrar Incidencia</Text>
      </TouchableOpacity>

      {alert && <Text style={styles.alert}>Incidencia Registrada</Text>}
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
