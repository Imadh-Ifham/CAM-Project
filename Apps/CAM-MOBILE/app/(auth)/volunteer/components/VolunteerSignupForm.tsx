import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Button } from "../../../../src/components/ui/Button";

type RegisterData = {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  skills: string;
  availability: string;
};

type Props = {
  onSubmit: (data: RegisterData) => void;
  onLogin: () => void;
};

export default function VolunteerSignupForm({ onSubmit, onLogin }: Props) {
  const [data, setData] = useState<RegisterData>({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    skills: "",
    availability: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await Promise.resolve();
      onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: spacing.lg }}>
      {/* Icon + Title */}
      <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.mutedBackground,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.sm,
          }}
        >
          <Feather name="users" size={28} color={colors.orange} />
        </View>
        <Text style={[typography.h2, { marginBottom: spacing.xs }]}>
          Make a Difference
        </Text>
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          Join our community of volunteers helping those in need
        </Text>
      </View>

      {/* Full Name + Age */}
      <View style={{ flexDirection: "row", marginBottom: spacing.md }}>
        <View style={{ flex: 2, marginRight: spacing.sm }}>
          <Text style={[typography.label, { marginBottom: spacing.xs }]}>
            Full Name
          </Text>
          <View style={{ position: "relative" }}>
            <Feather
              name="user"
              size={16}
              color={colors.muted}
              style={{ position: "absolute", left: 12, top: 14 }}
            />
            <TextInput
              value={data.fullName}
              onChangeText={(v) => setData((s) => ({ ...s, fullName: v }))}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              style={{
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.secondary,
                paddingLeft: 36,
                paddingRight: 12,
                color: colors.cardForeground,
              }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[typography.label, { marginBottom: spacing.xs }]}>
            Age
          </Text>
          <TextInput
            value={data.age}
            onChangeText={(v) => setData((s) => ({ ...s, age: v }))}
            placeholder="Age"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingHorizontal: 12,
              color: colors.cardForeground,
            }}
          />
        </View>
      </View>

      {/* Email */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Email Address
        </Text>
        <View style={{ position: "relative" }}>
          <Feather
            name="mail"
            size={16}
            color={colors.muted}
            style={{ position: "absolute", left: 12, top: 14 }}
          />
          <TextInput
            value={data.email}
            onChangeText={(v) => setData((s) => ({ ...s, email: v }))}
            placeholder="Enter your email"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
              color: colors.cardForeground,
            }}
          />
        </View>
      </View>

      {/* Phone */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Phone Number
        </Text>
        <View style={{ position: "relative" }}>
          <Feather
            name="phone"
            size={16}
            color={colors.muted}
            style={{ position: "absolute", left: 12, top: 14 }}
          />
          <TextInput
            value={data.phone}
            onChangeText={(v) => setData((s) => ({ ...s, phone: v }))}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
              color: colors.cardForeground,
            }}
          />
        </View>
      </View>

      {/* Password */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Password
        </Text>
        <View style={{ position: "relative" }}>
          <Feather
            name="lock"
            size={16}
            color={colors.muted}
            style={{ position: "absolute", left: 12, top: 14 }}
          />
          <TextInput
            value={data.password}
            onChangeText={(v) => setData((s) => ({ ...s, password: v }))}
            placeholder="Create a password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 44,
              color: colors.cardForeground,
            }}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle password visibility"
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={16}
              color={colors.muted}
            />
          </Pressable>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Confirm Password
        </Text>
        <View style={{ position: "relative" }}>
          <Feather
            name="lock"
            size={16}
            color={colors.muted}
            style={{ position: "absolute", left: 12, top: 14 }}
          />
          <TextInput
            value={data.confirmPassword}
            onChangeText={(v) => setData((s) => ({ ...s, confirmPassword: v }))}
            placeholder="Confirm your password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
              color: colors.cardForeground,
            }}
          />
        </View>
      </View>

      {/* Skills & Interests */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Skills & Interests
        </Text>
        <TextInput
          value={data.skills}
          onChangeText={(v) => setData((s) => ({ ...s, skills: v }))}
          placeholder="e.g., First Aid, Driving, Languages, Cooking..."
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          style={{
            minHeight: 72,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.secondary,
            padding: 12,
            color: colors.cardForeground,
          }}
        />
      </View>

      {/* Availability */}
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Availability
        </Text>
        <TextInput
          value={data.availability}
          onChangeText={(v) => setData((s) => ({ ...s, availability: v }))}
          placeholder="e.g., Weekends, evenings, 5-10 hours/week"
          placeholderTextColor={colors.muted}
          style={{
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.secondary,
            paddingHorizontal: 12,
            color: colors.cardForeground,
          }}
        />
      </View>

      {/* Submit */}
      <Button
        onPress={handleSubmit}
        style={{ height: 48, backgroundColor: colors.primary }}
        textStyle={{
          color: colors.primaryForeground,
          fontWeight: "700",
          marginLeft: spacing.sm,
        }}
        loading={loading}
      >
        <Feather name="heart" size={16} color={colors.primaryForeground} />
        <Text
          style={{
            color: colors.primaryForeground,
            fontWeight: "700",
            marginLeft: spacing.sm,
          }}
        >
          Join CAM Community
        </Text>
      </Button>

      {/* Sign in link */}
      <View style={{ alignItems: "center", marginTop: spacing.lg }}>
        <Pressable onPress={onLogin}>
          <Text
            style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}
          >
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
