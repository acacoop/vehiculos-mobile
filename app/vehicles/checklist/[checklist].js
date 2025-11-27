import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import {
  getMaintenanceChecklistById,
  updateChecklistItems,
} from "../../../services/maintenanceChecklists";
import { useEffect, useMemo, useState, useCallback } from "react";
import { DropDown } from "../../../components/DropDown";
import { colors } from "../../../constants/colors";

// Quarter labels for display
const QUARTER_LABELS = {
  1: "Q1",
  2: "Q2",
  3: "Q3",
  4: "Q4",
};

export default function Checklist() {
  const { checklist: checklistId } = useLocalSearchParams();
  const router = useRouter();
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChecklist() {
      setLoading(true);
      try {
        const data = await getMaintenanceChecklistById(checklistId);
        if (!data) {
          setError("Checklist no encontrado");
          setChecklistData(null);
          return;
        }
        setChecklistData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching checklist", err);
        setError(err.message || "No se pudo cargar el checklist");
        setChecklistData(null);
      } finally {
        setLoading(false);
      }
    }

    if (checklistId) {
      fetchChecklist();
    }
  }, [checklistId]);

  const categories = useMemo(() => {
    if (!checklistData?.items) return [];

    const categoryMap = {};
    checklistData.items.forEach((item) => {
      if (!categoryMap[item.category]) {
        categoryMap[item.category] = {
          id: item.category.toLowerCase().replace(/\s+/g, "-"),
          title: item.category,
          iconKey: getCategoryIcon(item.category),
          items: [],
        };
      }
      categoryMap[item.category].items.push({
        id: item.id,
        label: item.title,
      });
    });

    return Object.values(categoryMap);
  }, [checklistData]);

  // Initialize responses state from backend items
  const initialResponses = useMemo(() => {
    if (!categories.length) return {};
    return categories.reduce((acc, category) => {
      acc[category.id] = category.items.reduce((itemAcc, item) => {
        // Initialize as null (not yet answered)
        itemAcc[item.id] = null;
        return itemAcc;
      }, {});
      return acc;
    }, {});
  }, [categories]);

  const initialObservations = useMemo(() => {
    if (!categories.length) return {};
    return categories.reduce((acc, category) => {
      acc[category.id] = category.items.reduce((itemAcc, item) => {
        itemAcc[item.id] = "";
        return itemAcc;
      }, {});
      return acc;
    }, {});
  }, [categories]);

  const [responses, setResponses] = useState({});
  const [observations, setObservations] = useState({});

  useEffect(() => {
    setResponses(initialResponses);
  }, [initialResponses]);

  useEffect(() => {
    setObservations(initialObservations);
  }, [initialObservations]);

  const handleResponsesChange = (next) => {
    setResponses(next);
  };

  const handleObservationsChange = (next) => {
    setObservations(next);
  };

  // Check if all items have been answered
  const allItemsCompleted = useMemo(() => {
    if (!categories.length || !Object.keys(responses).length) return false;

    return categories.every((category) => {
      const categoryResponses = responses[category.id];
      if (!categoryResponses) return false;

      return category.items.every((item) => {
        const answer = categoryResponses[item.id];
        return answer === "yes" || answer === "no";
      });
    });
  }, [categories, responses]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!allItemsCompleted || !checklistData) return;

    setSubmitting(true);
    try {
      // Build payload for PATCH request
      const itemsPayload = checklistData.items.map((item) => {
        // Find the category for this item
        const category = categories.find((cat) =>
          cat.items.some((i) => i.id === item.id)
        );
        const categoryId = category?.id;
        const answer = categoryId ? responses[categoryId]?.[item.id] : null;
        const observation = categoryId
          ? observations[categoryId]?.[item.id] || ""
          : "";

        return {
          id: item.id,
          status: answer === "yes" ? "APROBADO" : "RECHAZADO",
          observations: observation,
        };
      });

      await updateChecklistItems(checklistId, { items: itemsPayload });

      Alert.alert("Éxito", "Checklist guardado correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Error submitting checklist", err);
      Alert.alert(
        "Error",
        err.message || "No se pudo guardar el checklist. Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    allItemsCompleted,
    checklistData,
    checklistId,
    categories,
    responses,
    observations,
    router,
  ]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#282D86" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const vehicleInfo = checklistData?.vehicle;
  const brandName = vehicleInfo?.model?.brand?.name || "";
  const modelName = vehicleInfo?.model?.name || "";

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Checklist Vehicular",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.licensePlateTitle}>
            Dominio: {vehicleInfo?.licensePlate || ""}
          </Text>
          <Text style={styles.subtitle}>
            {brandName && modelName
              ? `${brandName} ${modelName}`
              : "Marca y modelo desconocidos"}
          </Text>
          <Text style={styles.periodText}>
            Período: {QUARTER_LABELS[checklistData?.quarter]}{" "}
            {checklistData?.year}
          </Text>
        </View>
        <View style={{ width: "90%", alignItems: "center", paddingBottom: 20 }}>
          <DropDown
            categories={categories}
            value={responses}
            onChange={handleResponsesChange}
            observations={observations}
            onObservationsChange={handleObservationsChange}
          />
        </View>

        {/* Submit Button */}
        <Pressable
          style={[
            styles.submitButton,
            (!allItemsCompleted || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!allItemsCompleted || submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? "Guardando..." : "Guardar Checklist"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// Helper function to get icon for category
function getCategoryIcon(category) {
  const iconMap = {
    "Motor y Fluidos": "tool",
    "Luces y Señalización": "bulb1",
    "Neumáticos y Carrocería": "car",
    "Seguridad y Emergencia": "alerttriangle",
  };
  return iconMap[category] || "shield";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  header: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#00000012",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  licensePlateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#282D86",
  },
  subtitle: {
    fontSize: 16,
    color: "#7A80A6",
  },
  periodText: {
    fontSize: 14,
    color: "#9CA0C5",
    marginTop: 4,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    gap: 24,
    paddingBottom: 60,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#FE9000",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00000040",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#D0D4EB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
