import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { CollectionCard, CollectionItem } from "./components/CollectionCard";
import { CollectionHeader } from "./components/CollectionHeader";
import { CollectionModal } from "./components/CollectionModal";

export default function VolunteerCampaignCollect() {
  // Mock data - in production, this would come from API/Redux
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: 1,
      resource: "Food Packages",
      target: 25,
      location: "Local Grocery Store",
      assignedBy: "John Doe",
      status: "In Progress",
      dueDate: "2024-01-20",
      instructions:
        "Collect fresh produce and canned goods from the donation area. Please ensure items are properly packaged and labeled.",
      progress: 0,
    },
    {
      id: 2,
      resource: "Clothing Items",
      target: 15,
      location: "Community Center",
      assignedBy: "John Doe",
      status: "In Progress",
      dueDate: "2024-01-19",
      instructions:
        "Focus on winter coats and warm clothing items. Check for quality and cleanliness before collecting.",
      progress: 8,
    },
    {
      id: 3,
      resource: "Medical Supplies",
      target: 10,
      location: "City Hospital",
      assignedBy: "John Doe",
      status: "Completed",
      dueDate: "2024-01-17",
      instructions:
        "Collect first aid kits from the donation desk. Verify expiration dates on all medical items.",
      progress: 10,
    },
  ]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionItem | null>(null);

  // Calculate statistics
  const activeCount = collections.filter(
    (c) => c.status !== "Completed"
  ).length;
  const completedCount = collections.filter(
    (c) => c.status === "Completed"
  ).length;
  const totalCount = collections.length;

  // Handlers
  const handleStartCollection = (id: number) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;

    Alert.alert(
      "Start Collection",
      "Are you ready to start this collection task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: () => {
            // Update status to In Progress
            setCollections(
              collections.map((c) =>
                c.id === id ? { ...c, status: "In Progress" as const } : c
              )
            );
            // Open modal
            setSelectedCollection({ ...collection, status: "In Progress" });
            setModalVisible(true);
          },
        },
      ]
    );
  };

  const handleUpdateProgress = (id: number) => {
    const collection = collections.find((c) => c.id === id);
    if (!collection) return;

    setSelectedCollection(collection);
    setModalVisible(true);
  };

  const handleCollectionSubmit = (collected: number, notes: string) => {
    if (!selectedCollection) return;

    // Update the collection with new progress
    setCollections(
      collections.map((c) => {
        if (c.id === selectedCollection.id) {
          const newProgress = c.progress + collected;
          const isCompleted = newProgress >= c.target;

          return {
            ...c,
            progress: newProgress,
            status: isCompleted ? ("Completed" as const) : c.status,
          };
        }
        return c;
      })
    );

    Alert.alert(
      "Success",
      `Successfully collected ${collected} ${selectedCollection.resource}!${
        notes ? `\n\nNotes: ${notes}` : ""
      }`
    );

    setSelectedCollection(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl * 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Stats */}
        <CollectionHeader
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {/* Collection Cards */}
        <View style={{ gap: spacing.lg }}>
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onStartCollection={handleStartCollection}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </View>
      </ScrollView>

      {/* Collection Modal */}
      {selectedCollection && (
        <CollectionModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedCollection(null);
          }}
          collectionItem={{
            resource: selectedCollection.resource,
            target: selectedCollection.target,
            location: selectedCollection.location,
            instructions: selectedCollection.instructions,
          }}
          onSubmit={handleCollectionSubmit}
        />
      )}
    </View>
  );
}
