import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../src/components/ui/Card";
import { Button } from "../../../../src/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

type TaskStatus = "In Progress" | "Pending" | "Completed";
type Priority = "High" | "Medium" | "Low";
type TaskType = "Collection" | "Packaging" | "Delivery" | "Other";

export default function CampaignTasks() {
  const volunteers = useMemo(
    () => [
      { id: 1, name: "Alice Johnson" },
      { id: 2, name: "Bob Wilson" },
      { id: 3, name: "Carol Davis" },
    ],
    []
  );

  const tasks = useMemo(
    () => [
      {
        id: 1,
        title: "Pack Food Packages",
        description: "Organize and pack 50 food packages for distribution",
        assignedTo: "Alice Johnson",
        status: "In Progress" as TaskStatus,
        priority: "High" as Priority,
        dueDate: "2024-01-20",
        location: "Community Center",
        estimatedTime: "3 hours",
        taskType: "Packaging" as TaskType,
      },
      {
        id: 2,
        title: "Deliver to East Side School",
        description: "Transport and distribute blankets to East Side School",
        assignedTo: "Bob Wilson",
        status: "Pending" as TaskStatus,
        priority: "Medium" as Priority,
        dueDate: "2024-01-22",
        location: "East Side School",
        estimatedTime: "2 hours",
        taskType: "Delivery" as TaskType,
      },
      {
        id: 3,
        title: "Community Outreach",
        description: "Visit households for needs assessment",
        assignedTo: "Carol Davis",
        status: "Completed" as TaskStatus,
        priority: "Medium" as Priority,
        dueDate: "2024-01-18",
        location: "North District",
        estimatedTime: "4 hours",
        taskType: "Other" as TaskType,
      },
    ],
    []
  );

  // Add Task modal state
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<string | undefined>();
  const [priority, setPriority] = useState<Priority>("Medium");
  const [taskType, setTaskType] = useState<TaskType>("Collection");
  const [dueDate, setDueDate] = useState("");
  const [estTime, setEstTime] = useState("");
  const [location, setLocation] = useState("");

  // Pickers
  const [assigneePicker, setAssigneePicker] = useState(false);
  const [priorityPicker, setPriorityPicker] = useState(false);
  const [typePicker, setTypePicker] = useState(false);

  const StatusBadge = ({ status }: { status: TaskStatus }) => {
    const map: Record<TaskStatus, { bg: string; fg: string }> = {
      "In Progress": { bg: colors.blue, fg: "#fff" },
      Pending: { bg: "#f59e0b", fg: "#fff" },
      Completed: { bg: colors.green, fg: "#fff" },
    };
    const s = map[status];
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: s.bg,
        }}
      >
        <Text style={{ color: s.fg, fontWeight: "700", fontSize: 12 }}>
          {status}
        </Text>
      </View>
    );
  };

  const PriorityPill = ({ value }: { value: Priority }) => {
    const style: Record<Priority, { bg: string; fg: string }> = {
      High: { bg: "#fee2e2", fg: "#dc2626" },
      Medium: { bg: "#fef3c7", fg: "#b45309" },
      Low: { bg: "#dcfce7", fg: "#15803d" },
    };
    const s = style[value];
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          backgroundColor: s.bg,
          alignSelf: "flex-end",
        }}
      >
        <Text style={{ color: s.fg, fontWeight: "700", fontSize: 12 }}>
          {value}
        </Text>
      </View>
    );
  };

  const handleCreateTask = () => {
    // For now, just mimic creation and close
    setAddOpen(false);
    setTitle("");
    setDescription("");
    setAssignee(undefined);
    setPriority("Medium");
    setTaskType("Collection");
    setDueDate("");
    setEstTime("");
    setLocation("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[typography.h3]}>Task Management</Text>
          <Button size="sm" onPress={() => setAddOpen(true)}>
            <Ionicons name="add" size={16} color={colors.primaryForeground} />
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "700",
                marginLeft: 6,
              }}
            >
              Add Task
            </Text>
          </Button>
        </View>

        {/* Tasks list */}
        <View style={{ gap: spacing.md }}>
          {tasks.map((t) => (
            <Card key={t.id}>
              <CardContent style={{ padding: spacing.lg, gap: spacing.sm }}>
                {/* Title + status */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1, paddingRight: spacing.md }}>
                    <Text style={{ fontWeight: "700" }}>{t.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {t.description}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 6 }}>
                    <StatusBadge status={t.status} />
                    <PriorityPill value={t.priority} />
                  </View>
                </View>

                {/* Details */}
                <View style={{ gap: 6 }}>
                  <Row
                    icon="person-outline"
                    text={`Assigned: ${t.assignedTo}`}
                  />
                  <Row icon="location-outline" text={t.location} />
                  <Row icon="calendar-outline" text={`Due: ${t.dueDate}`} />
                  <Row
                    icon="time-outline"
                    text={`Est. time: ${t.estimatedTime}`}
                  />
                  <Row icon="clipboard-outline" text={`Type: ${t.taskType}`} />
                </View>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.sm,
                    marginTop: spacing.sm,
                  }}
                >
                  <Button size="sm" variant="outline" style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontWeight: "700",
                      }}
                    >
                      Edit
                    </Text>
                  </Button>
                  <Button size="sm" variant="outline" style={{ flex: 1 }}>
                    <Ionicons
                      name="call-outline"
                      size={14}
                      color={colors.cardForeground}
                    />
                    <Text
                      style={{
                        color: colors.cardForeground,
                        fontWeight: "700",
                        marginLeft: 6,
                      }}
                    >
                      Contact
                    </Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={addOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAddOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.15)",
            padding: spacing.lg,
            justifyContent: "center",
          }}
          onPress={() => setAddOpen(false)}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                padding: spacing.lg,
                borderBottomWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={[typography.h3, { fontSize: 16 }]}>
                Create New Task
              </Text>
              <Text style={{ color: colors.muted, marginTop: 4 }}>
                Assign a new task to a volunteer in your campaign.
              </Text>
            </View>

            <View style={{ padding: spacing.lg, gap: spacing.md }}>
              {/* Title */}
              <FieldInput
                label="Task Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
              />

              {/* Description */}
              <FieldInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the task in detail..."
                multiline
                numberOfLines={3}
              />

              {/* Assignee */}
              <View>
                <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                  Assign to Volunteer
                </Text>
                <Pressable
                  onPress={() => setAssigneePicker(true)}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.mutedBackground,
                    paddingHorizontal: spacing.md,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: assignee ? colors.cardForeground : colors.muted,
                    }}
                  >
                    {assignee || "Select volunteer"}
                  </Text>
                  <Ionicons
                    name="chevron-down-outline"
                    size={16}
                    color={colors.muted}
                  />
                </Pressable>
              </View>

              {/* Priority & Type */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                    Priority
                  </Text>
                  <Pressable
                    onPress={() => setPriorityPicker(true)}
                    style={{
                      height: 44,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.mutedBackground,
                      paddingHorizontal: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: colors.cardForeground }}>
                      {priority}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={16}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 6 }}>
                    Task Type
                  </Text>
                  <Pressable
                    onPress={() => setTypePicker(true)}
                    style={{
                      height: 44,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.mutedBackground,
                      paddingHorizontal: spacing.md,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: colors.cardForeground }}>
                      {taskType}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={16}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Due date & Est time */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <FieldInput
                  style={{ flex: 1 }}
                  label="Due Date"
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="mm/dd/yyyy"
                />
                <FieldInput
                  style={{ flex: 1 }}
                  label="Estimated Time"
                  value={estTime}
                  onChangeText={setEstTime}
                  placeholder="e.g., 2 hours"
                />
              </View>

              {/* Location */}
              <FieldInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="Where should this task be performed?"
              />

              {/* Footer buttons */}
              <View style={{ flexDirection: "row", gap: spacing.md }}>
                <Button
                  variant="outline"
                  style={{ flex: 1 }}
                  onPress={() => setAddOpen(false)}
                >
                  <Text
                    style={{ color: colors.cardForeground, fontWeight: "700" }}
                  >
                    Cancel
                  </Text>
                </Button>
                <Button style={{ flex: 1 }} onPress={handleCreateTask}>
                  <Text
                    style={{
                      color: colors.primaryForeground,
                      fontWeight: "700",
                    }}
                  >
                    Create Task
                  </Text>
                </Button>
              </View>
            </View>
          </View>

          {/* Pickers */}
          <PickerModal
            visible={assigneePicker}
            title="Select volunteer"
            options={volunteers.map((v) => v.name)}
            selected={assignee}
            onSelect={(v) => {
              setAssignee(v);
              setAssigneePicker(false);
            }}
            onClose={() => setAssigneePicker(false)}
          />
          <PickerModal
            visible={priorityPicker}
            title="Select priority"
            options={["High", "Medium", "Low"]}
            selected={priority}
            onSelect={(v) => {
              setPriority(v as Priority);
              setPriorityPicker(false);
            }}
            onClose={() => setPriorityPicker(false)}
          />
          <PickerModal
            visible={typePicker}
            title="Select task type"
            options={["Collection", "Packaging", "Delivery", "Other"]}
            selected={taskType}
            onSelect={(v) => {
              setTaskType(v as TaskType);
              setTypePicker(false);
            }}
            onClose={() => setTypePicker(false)}
          />
        </Pressable>
      </Modal>
    </View>
  );
}

function Row({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Ionicons name={icon} size={14} color={colors.muted} />
      <Text style={{ color: colors.cardForeground, flex: 1 }}>{text}</Text>
    </View>
  );
}

function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  style,
  multiline,
  numberOfLines,
}: {
  label: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}) {
  return (
    <View style={style}>
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          height: multiline ? undefined : 44,
          minHeight: multiline ? 72 : undefined,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.mutedBackground,
          paddingHorizontal: spacing.md,
          paddingVertical: multiline ? spacing.md : 0,
          textAlignVertical: multiline ? "top" : "center",
          color: colors.cardForeground,
        }}
      />
    </View>
  );
}

function PickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,0.15)",
          padding: spacing.lg,
          justifyContent: "center",
        }}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              padding: spacing.lg,
              borderBottomWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={[typography.h3, { fontSize: 16 }]}>{title}</Text>
          </View>
          <View style={{ paddingHorizontal: spacing.lg }}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => onSelect(opt)}
                style={{
                  paddingVertical: spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ flex: 1 }}>{opt}</Text>
                {selected === opt && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
