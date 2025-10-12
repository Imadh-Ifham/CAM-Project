import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CampaignFormData, Resources } from "@/src/types/campaign.type";

interface CampaignResourcesProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// Resource interface is defined in CreateCampaign.tsx

const resourceCategories = [
  { id: "food", label: "Food & Water", icon: "restaurant", color: "#fbbf24" },
  {
    id: "medical",
    label: "Medical Supplies",
    icon: "medical",
    color: "#4ade80",
  },
  { id: "clothing", label: "Clothing", icon: "shirt", color: "#f472b6" },
  { id: "shelter", label: "Shelter Materials", icon: "home", color: "#60a5fa" },
  { id: "tools", label: "Tools & Equipment", icon: "hammer", color: "#a78bfa" },
  { id: "transport", label: "Transportation", icon: "car", color: "#34d399" },
];

const commonResources = {
  food: ["Rice", "Flour", "Canned Food", "Water Bottles", "Dry Rations"],
  medical: [
    "First Aid Kits",
    "Bandages",
    "Antiseptic",
    "Medicines",
    "Thermometers",
  ],
  clothing: ["Blankets", "Shirts", "Pants", "Undergarments", "Shoes"],
  shelter: ["Tents", "Tarpaulins", "Sleeping Bags", "Pillows", "Mats"],
  tools: ["Flashlights", "Batteries", "Radios", "Generators", "Rope"],
  transport: ["Vehicles", "Fuel", "Bicycles", "Boats", "Helicopters"],
};

const commonUnits = [
  "pieces",
  "kg",
  "liters",
  "boxes",
  "packs",
  "units",
  "meters",
];

export default function CampaignResources({
  formData,
  updateFormData,
  onValidationChange,
}: CampaignResourcesProps) {
  const [newResource, setNewResource] = useState<{
    name?: string;
    requiredQuantity?: number;
    unit?: string;
    category?: string;
  }>({
    name: "",
    requiredQuantity: 1,
    unit: "pieces",
    category: "food",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Validation logic
  const hasValidResources =
    formData.resources.length > 0 &&
    formData.resources.some((resource) => resource.requiredQuantity > 0);
  const isValid = hasValidResources;

  // Notify parent about validation status
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const generateResourceId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addResource = () => {
    if (
      !newResource.name ||
      !newResource.requiredQuantity ||
      newResource.requiredQuantity <= 0
    ) {
      Alert.alert("Error", "Please fill in all resource details");
      return;
    }

    const resource: Resources = {
      id: generateResourceId(),
      name: newResource.name!,
      category: newResource.category!,
      requiredQuantity: newResource.requiredQuantity!,
      availableQuantity: 0, // Initially 0, will be updated during campaign execution
      unit: newResource.unit!,
    };

    updateFormData({
      resources: [...formData.resources, resource],
    });

    setNewResource({
      name: "",
      requiredQuantity: 0,
      unit: "pieces",
      category: "food",
    });
    setShowAddForm(false);
  };

  const removeResource = (resourceId: string) => {
    updateFormData({
      resources: formData.resources.filter((r) => r.id !== resourceId),
    });
  };

  const updateResourceQuantity = (resourceId: string, quantity: number) => {
    updateFormData({
      resources: formData.resources.map((r) =>
        r.id === resourceId ? { ...r, requiredQuantity: quantity } : r
      ),
    });
  };

  const addCommonResource = (resourceName: string, category: string) => {
    const resource: Resources = {
      id: generateResourceId(),
      name: resourceName,
      category: category,
      requiredQuantity: 1,
      availableQuantity: 0,
      unit: "pieces",
    };

    updateFormData({
      resources: [...formData.resources, resource],
    });
  };

  const getTotalResourcesByCategory = () => {
    return formData.resources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const categoryTotals = getTotalResourcesByCategory();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Budget Estimation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget Estimation</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estimated Budget (LKR)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.estimatedBudget.toString()}
            onChangeText={(text) =>
              updateFormData({ estimatedBudget: parseInt(text) || 0 })
            }
            placeholder="Enter estimated budget"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Resource Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resource Categories</Text>
        <View style={styles.categoriesGrid}>
          {resourceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.categoryCardActive,
              ]}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? "" : category.id
                )
              }
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color + "20" },
                ]}
              >
                <Ionicons
                  name={category.icon as any}
                  size={20}
                  color={category.color}
                />
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              {categoryTotals[category.id] && (
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: category.color },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>
                    {categoryTotals[category.id]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Add Common Resources */}
      {selectedCategory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Quick Add -{" "}
            {resourceCategories.find((c) => c.id === selectedCategory)?.label}
          </Text>
          <View style={styles.quickAddContainer}>
            {commonResources[
              selectedCategory as keyof typeof commonResources
            ]?.map((resource) => (
              <TouchableOpacity
                key={resource}
                style={styles.quickAddButton}
                onPress={() => addCommonResource(resource, selectedCategory)}
              >
                <Ionicons name="add-circle" size={16} color="#00ff94" />
                <Text style={styles.quickAddText}>{resource}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Current Resources */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Required Resources ({formData.resources.length})
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Ionicons
              name={showAddForm ? "close" : "add"}
              size={20}
              color="#00ff94"
            />
            <Text style={styles.addButtonText}>
              {showAddForm ? "Cancel" : "Add Custom"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Resource Form */}
        {showAddForm && (
          <View style={styles.addForm}>
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Resource Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newResource.name}
                  onChangeText={(text) =>
                    setNewResource({ ...newResource, name: text })
                  }
                  placeholder="Enter resource name"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Quantity</Text>
                <TextInput
                  style={styles.formInput}
                  value={newResource.requiredQuantity?.toString() || ""}
                  onChangeText={(text) =>
                    setNewResource({
                      ...newResource,
                      requiredQuantity: parseInt(text) || 0,
                    })
                  }
                  placeholder="0"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formField, { flex: 1 }]}>
                <Text style={styles.formLabel}>Unit</Text>
                <TouchableOpacity style={styles.unitSelector}>
                  <Text style={styles.unitText}>{newResource.unit}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addResourceButton}
              onPress={addResource}
            >
              <Text style={styles.addResourceButtonText}>Add Resource</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Validation Message */}
        {!hasValidResources && formData.resources.length > 0 && (
          <View style={styles.validationContainer}>
            <Ionicons name="warning" size={16} color="#ff4444" />
            <Text style={styles.validationError}>
              At least one resource must have a quantity greater than 0
            </Text>
          </View>
        )}

        {/* Resources List */}
        <View style={styles.resourcesList}>
          {formData.resources.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color="#666" />
              <Text style={styles.emptyStateText}>No resources added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add resources using the categories above or custom form
              </Text>
            </View>
          ) : (
            formData.resources.map((resource) => {
              const category = resourceCategories.find(
                (c) => c.id === resource.category
              );
              return (
                <View key={resource.id} style={styles.resourceCard}>
                  <View
                    style={[
                      styles.resourceIcon,
                      { backgroundColor: category?.color + "20" || "#333" },
                    ]}
                  >
                    <Ionicons
                      name={(category?.icon as any) || "cube"}
                      size={18}
                      color={category?.color || "#666"}
                    />
                  </View>

                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceCategory}>
                      {category?.label || resource.category}
                    </Text>
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Required:</Text>
                      <TextInput
                        style={[
                          styles.quantityInput,
                          resource.requiredQuantity === 0 &&
                            styles.quantityInputError,
                        ]}
                        value={resource.requiredQuantity.toString()}
                        onChangeText={(text) =>
                          updateResourceQuantity(
                            resource.id,
                            parseInt(text) || 0
                          )
                        }
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#666"
                      />
                      <Text style={styles.unitText}>{resource.unit}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeResource(resource.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Resources Summary */}
      {formData.resources.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Resources:</Text>
              <Text style={styles.summaryValue}>
                {formData.resources.length} items
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Categories:</Text>
              <Text style={styles.summaryValue}>
                {Object.keys(categoryTotals).length}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated Budget:</Text>
              <Text style={styles.summaryValue}>
                LKR {formData.estimatedBudget.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "48%",
    position: "relative",
  },
  categoryCardActive: {
    borderColor: "#00ff94",
    backgroundColor: "#0a1a0f",
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    color: "#bbb",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  categoryBadgeText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
  },
  quickAddContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  quickAddText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "500",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#00ff94",
    fontSize: 14,
    fontWeight: "500",
  },
  addForm: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  formField: {
    flex: 2,
  },
  formLabel: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 14,
  },
  unitSelector: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addResourceButton: {
    backgroundColor: "#00ff94",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addResourceButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  resourcesList: {
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptyStateSubtext: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  resourceCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  resourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  resourceDetails: {
    color: "#888",
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  summaryCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#bbb",
    fontSize: 14,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  resourceCategory: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityLabel: {
    color: "#bbb",
    fontSize: 12,
  },
  quantityInput: {
    backgroundColor: "#333",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "#fff",
    fontSize: 12,
    minWidth: 50,
    textAlign: "center",
  },
  unitText: {
    color: "#888",
    fontSize: 12,
  },
  validationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff444420",
    borderColor: "#ff4444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  validationError: {
    color: "#ff4444",
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  quantityInputError: {
    borderColor: "#ff4444",
    borderWidth: 1,
  },
});
