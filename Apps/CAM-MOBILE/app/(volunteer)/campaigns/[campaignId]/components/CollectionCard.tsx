import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../../src/styles/colors";
import { spacing } from "../../../../../src/styles/spacing";
import { Card, CardContent } from "../../../../../src/components/ui/Card";
import { Button } from "../../../../../src/components/ui/Button";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";

export type CollectionItem = {
  id: number;
  resource: string;
  target: number;
  location: string;
  assignedBy: string;
  status: "Assigned" | "In Progress" | "Completed";
  dueDate: string;
  instructions: string;
  progress: number;
};

type CollectionCardProps = {
  collection: CollectionItem;
  onStartCollection: (id: number) => void;
  onUpdateProgress: (id: number) => void;
};

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onStartCollection,
  onUpdateProgress,
}) => {
  const percent = Math.min(
    100,
    Math.round((collection.progress / collection.target) * 100)
  );

  return (
    <Card
      style={{ borderRadius: 16, borderColor: colors.border, borderWidth: 1 }}
    >
      <CardContent style={{ padding: spacing.lg }}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.cardForeground,
                marginBottom: 4,
              }}
            >
              {collection.resource}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="cube-outline" size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 13 }}>
                Target: {collection.target} items
              </Text>
            </View>
          </View>
          <StatusBadge status={collection.status} />
        </View>

        {/* Metadata Section */}
        <View
          style={{
            backgroundColor: colors.mutedBackground,
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.md,
            gap: spacing.sm,
          }}
        >
          <MetaRow
            icon="location"
            text={collection.location}
            label="Location"
          />
          <MetaRow
            icon="person"
            text={`Assigned by ${collection.assignedBy}`}
            label="Agent"
          />
          <MetaRow
            icon="calendar"
            text={formatDate(collection.dueDate)}
            label="Due Date"
          />
        </View>

        {/* Progress Section */}
        {collection.status !== "Assigned" && (
          <View style={{ marginBottom: spacing.md }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.sm,
              }}
            >
              <Text
                style={{
                  color: colors.cardForeground,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Collection Progress
              </Text>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {collection.progress}/{collection.target}
              </Text>
            </View>
            <ProgressBar percent={percent} />
          </View>
        )}

        {/* Instructions Section */}
        <View
          style={{
            backgroundColor: colors.mutedBackground,
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.md,
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: spacing.sm,
            }}
          >
            <Ionicons
              name="information-circle"
              size={16}
              color={colors.primary}
            />
            <Text
              style={{
                color: colors.cardForeground,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Instructions
            </Text>
          </View>
          <Text
            style={{
              color: colors.muted,
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            {collection.instructions}
          </Text>
        </View>

        {/* Action Buttons */}
        <ActionButtons
          status={collection.status}
          onStart={() => onStartCollection(collection.id)}
          onUpdate={() => onUpdateProgress(collection.id)}
        />
      </CardContent>
    </Card>
  );
};

// Helper Components
const MetaRow: React.FC<{ icon: string; text: string; label: string }> = ({
  icon,
  text,
  label,
}) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.card,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={`${icon}-outline` as any}
        size={16}
        color={colors.primary}
      />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 2 }}>
        {label}
      </Text>
      <Text
        style={{
          color: colors.cardForeground,
          fontSize: 13,
          fontWeight: "500",
        }}
      >
        {text}
      </Text>
    </View>
  </View>
);

const ActionButtons: React.FC<{
  status: CollectionItem["status"];
  onStart: () => void;
  onUpdate: () => void;
}> = ({ status, onStart, onUpdate }) => {
  if (status === "Assigned") {
    return (
      <Button onPress={onStart}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="play-circle" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            Start Collection
          </Text>
        </View>
      </Button>
    );
  }

  if (status === "In Progress") {
    return (
      <Button onPress={onUpdate}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
            Update Progress
          </Text>
        </View>
      </Button>
    );
  }

  return (
    <View
      style={{
        backgroundColor: "#1a2b1f",
        borderRadius: 12,
        padding: spacing.md,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.green,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="checkmark-circle" size={20} color={colors.green} />
        <Text style={{ color: colors.green, fontSize: 14, fontWeight: "600" }}>
          Collection Completed Successfully
        </Text>
      </View>
    </View>
  );
};

// Helper function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
