import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

interface IIncidencia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  foto: string;
  audio: string;
}

export default function Incidencias() {
  const [incidencias, setIncidencias] = useState<IIncidencia[]>([]);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] =
    useState<IIncidencia | null>(null);
  const [audioSeleccionado, setAudioSeleccionado] = useState<string | null>(
    null
  );
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para controlar la visibilidad del modal de confirmación

  useEffect(() => {
    obtenerIncidencias();
  }, [incidencias]);

  const obtenerIncidencias = async () => {
    try {
      const incidenciasJson = await AsyncStorage.getItem("incidencias");
      if (incidenciasJson != null) {
        const parsedIncidencias: IIncidencia[] = JSON.parse(incidenciasJson);
        setIncidencias(parsedIncidencias);
        setShowDeleteButton(parsedIncidencias.length > 0);
      } else {
        setIncidencias([]);
        setShowDeleteButton(false);
      }
    } catch (e) {
      console.error("Error obteniendo incidencias:", e);
    }
  };

  const reproducirAudio = async (audioUri: string) => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: audioUri });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error al reproducir el audio:", error);
    }
  };

  const confirmarBorrarTodasLasIncidencias = async () => {
    try {
      await AsyncStorage.removeItem("incidencias");
      setIncidencias([]);
      setShowDeleteButton(false);
      setShowConfirmModal(false); // Ocultar el modal de confirmación después de borrar las incidencias
      console.log("Todas las incidencias han sido borradas.");
    } catch (error) {
      console.error("Error al borrar las incidencias:", error);
    }
  };

  const handleBorrarTodasLasIncidencias = () => {
    setShowConfirmModal(true); // Mostrar el modal de confirmación al presionar el botón
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Listado de Incidencias</Text>
        <View style={styles.incidenciasContainer}>
          {incidencias.map((incidencia) => (
            <TouchableOpacity
              key={incidencia.id}
              style={styles.incidenciaCard}
              onPress={() => setIncidenciaSeleccionada(incidencia)}
            >
              <Image
                source={{ uri: incidencia.foto }}
                style={styles.incidenciaImage}
              />
              <Text style={styles.incidenciaTitle}>{incidencia.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {incidenciaSeleccionada && (
          <Modal visible={true} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {incidenciaSeleccionada.titulo}
                </Text>
                <Text style={styles.modalDate}>
                  {incidenciaSeleccionada.fecha}
                </Text>
                <Image
                  source={{ uri: incidenciaSeleccionada.foto }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalDescription}>
                  {incidenciaSeleccionada.descripcion}
                </Text>
                {incidenciaSeleccionada.audio && (
                  <TouchableOpacity
                    onPress={() =>
                      reproducirAudio(incidenciaSeleccionada.audio)
                    }
                    style={styles.btnAudioPlay}
                  >
                    <Text style={styles.btnText}>
                      <Ionicons name={"play-circle-outline"} size={28} />
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setIncidenciaSeleccionada(null);
                    setAudioSeleccionado(null);
                  }}
                  style={styles.btnPrimary}
                >
                  <Text style={styles.btnText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {showDeleteButton && (
          <TouchableOpacity
            onPress={handleBorrarTodasLasIncidencias}
            style={styles.deleteButton}
          >
            <Text style={styles.btnText}>Borrar Todas las Incidencias</Text>
          </TouchableOpacity>
        )}

        {/* Modal de confirmación */}
        <Modal
          visible={showConfirmModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Acción</Text>
              <Text style={styles.modalDescription}>
                ¿Estás seguro de que deseas borrar todas las incidencias?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={confirmarBorrarTodasLasIncidencias}
                  style={styles.btnPrimary}
                >
                  <Text style={styles.btnText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 36,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 26,
    textAlign: "center",
    color: "#2f6682",
  },
  incidenciasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  incidenciaCard: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  incidenciaImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  incidenciaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f6682",
  },
  modalDate: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
    textAlign: "left",
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalDescription: {
    textAlign: "justify",
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#b33030",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  btnPrimary: {
    backgroundColor: "#2f6682",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
  },
  btnAudioPlay: {
    backgroundColor: "#b33030",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 100,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#b33030",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: "center",
  },
});
