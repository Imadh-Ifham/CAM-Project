import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TimelineEvent {
  date: string;
  event: string;
  type: "milestone" | "activity" | "issue" | "update";
}

interface Campaign {
  id: string;
  timeline: TimelineEvent[];
}

interface CampaignTimelineProps {
  campaign: Campaign;
}

// Extended mock timeline data
const mockTimelineEvents: TimelineEvent[] = [
  { date: "2024-01-15", event: "Campaign launched", type: "milestone" },
  {
    date: "2024-01-15",
    event: "Initial team meeting conducted",
    type: "activity",
  },
  {
    date: "2024-01-16",
    event: "First volunteer team deployed to affected areas",
    type: "activity",
  },
  {
    date: "2024-01-17",
    event: "Resource collection drive started",
    type: "activity",
  },
  {
    date: "2024-01-18",
    event: "Resource distribution began",
    type: "activity",
  },
  {
    date: "2024-01-19",
    event: "Weather conditions delayed operations",
    type: "issue",
  },
  {
    date: "2024-01-20",
    event: "50% progress milestone reached",
    type: "milestone",
  },
  {
    date: "2024-01-21",
    event: "Additional medical supplies received",
    type: "update",
  },
  {
    date: "2024-01-22",
    event: "Additional volunteers recruited",
    type: "activity",
  },
  {
    date: "2024-01-23",
    event: "Community feedback session held",
    type: "activity",
  },
  { date: "2024-01-24", event: "Budget increased by 20%", type: "update" },
  {
    date: "2024-01-25",
    event: "Emergency shelter setup completed",
    type: "milestone",
  },
];

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  overviewCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  overviewTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#9ca3af",
    fontSize: 12,
  },
  searchContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 12,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabActive: {
    backgroundColor: "#00ff94",
    borderColor: "#00ff94",
  },
  filterTabInactive: {
    backgroundColor: "#1f2937",
    borderColor: "#4b5563",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#000000",
  },
  filterTabTextInactive: {
    color: "#9ca3af",
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: "row",
  },
  dateColumn: {
    width: 64,
    alignItems: "center",
    marginRight: 12,
  },
  dateCard: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  dateDay: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  dateMonth: {
    color: "#9ca3af",
    fontSize: 12,
  },
  timelineColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    height: 48,
    backgroundColor: "#374151",
    marginTop: 8,
  },
  eventCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eventTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventType: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    marginLeft: 8,
  },
  eventYear: {
    color: "#6b7280",
    fontSize: 12,
  },
  eventText: {
    color: "#ffffff",
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#00ff94",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

function CampaignTimelineComponent({ campaign }: CampaignTimelineProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allEvents = [...mockTimelineEvents, ...campaign.timeline];

  const filteredEvents = allEvents
    .filter((event) => {
      const matchesType = filterType === "all" || event.type === filterType;
      const matchesSearch = event.event
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return "flag";
      case "activity":
        return "play-circle";
      case "issue":
        return "warning";
      case "update":
        return "information-circle";
      default:
        return "ellipse";
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "milestone":
        return "#00ff94";
      case "activity":
        return "#60a5fa";
      case "issue":
        return "#ff4444";
      case "update":
        return "#fbbf24";
      default:
        return "#666";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
    };
  };

  const filterOptions = [
    { key: "all", label: "All Events", count: allEvents.length },
    {
      key: "milestone",
      label: "Milestones",
      count: allEvents.filter((e) => e.type === "milestone").length,
    },
    {
      key: "activity",
      label: "Activities",
      count: allEvents.filter((e) => e.type === "activity").length,
    },
    {
      key: "issue",
      label: "Issues",
      count: allEvents.filter((e) => e.type === "issue").length,
    },
    {
      key: "update",
      label: "Updates",
      count: allEvents.filter((e) => e.type === "update").length,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Timeline Stats */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Timeline Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#00ff94" }]}>
              {allEvents.filter((e) => e.type === "milestone").length}
            </Text>
            <Text style={styles.statLabel}>Milestones</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#60a5fa" }]}>
              {allEvents.filter((e) => e.type === "activity").length}
            </Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#ff4444" }]}>
              {allEvents.filter((e) => e.type === "issue").length}
            </Text>
            <Text style={styles.statLabel}>Issues</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#fbbf24" }]}>
              {allEvents.filter((e) => e.type === "update").length}
            </Text>
            <Text style={styles.statLabel}>Updates</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search timeline events..."
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterTab,
                filterType === option.key
                  ? styles.filterTabActive
                  : styles.filterTabInactive,
              ]}
              onPress={() => setFilterType(option.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterType === option.key
                    ? styles.filterTabTextActive
                    : styles.filterTabTextInactive,
                ]}
              >
                {option.label} ({option.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Timeline Events */}
      <View style={styles.timelineList}>
        {filteredEvents.map((event, index) => {
          const dateInfo = formatDate(event.date);
          const eventColor = getEventColor(event.type);

          return (
            <View key={index} style={styles.timelineItem}>
              {/* Date Column */}
              <View style={styles.dateColumn}>
                <View style={styles.dateCard}>
                  <Text style={styles.dateDay}>{dateInfo.day}</Text>
                  <Text style={styles.dateMonth}>{dateInfo.month}</Text>
                </View>
              </View>

              {/* Timeline Line */}
              <View style={styles.timelineColumn}>
                <View
                  style={[styles.timelineDot, { backgroundColor: eventColor }]}
                />
                {index < filteredEvents.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
              </View>

              {/* Event Content */}
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View style={styles.eventTypeContainer}>
                    <Ionicons
                      name={getEventIcon(event.type) as any}
                      size={14}
                      color={eventColor}
                    />
                    <Text style={[styles.eventType, { color: eventColor }]}>
                      {event.type}
                    </Text>
                  </View>
                  <Text style={styles.eventYear}>{dateInfo.year}</Text>
                </View>

                <Text style={styles.eventText}>{event.event}</Text>
              </View>
            </View>
          );
        })}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No events found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Try adjusting your search criteria or filter"
                : "No timeline events match the selected filter"}
            </Text>
          </View>
        )}
      </View>

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color="#000" />
        <Text style={styles.addButtonText}>Add Timeline Event</Text>
      </TouchableOpacity>
    </View>
  );
}

export { CampaignTimelineComponent as CampaignTimeline };
