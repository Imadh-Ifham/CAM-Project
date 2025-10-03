import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Button } from "../../../../src/components/ui/Button";

type RegisterData = {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  password: string;
  confirmPassword: string;
  experience?: string;
};

type Props = {
  onSubmit: (data: RegisterData) => void;
  onLogin: () => void;
};

export default function AgentSignupForm({ onSubmit, onLogin }: Props) {
  const [data, setData] = useState<RegisterData>({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    password: "",
    confirmPassword: "",
    experience: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: validation can be added here (e.g., password match)
      await Promise.resolve();
      onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: spacing.lg }}>
      {/* Top icon and titles */}
      <View style={{ alignItems: "center", marginBottom: spacing.lg }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#dcfce7", // green-100
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.sm,
          }}
        >
          <Feather name="user-check" size={28} color="#16a34a" />
        </View>
        <Text style={[typography.h2, { marginBottom: spacing.xs }]}>
          Become an Agent
        </Text>
        <Text style={{ color: colors.muted, textAlign: "center" }}>
          Help coordinate aid distribution in your community
        </Text>
      </View>

      {/* Full Name */}
      <View style={{ marginBottom: spacing.md }}>
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
            placeholder="Enter your full name"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
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
            keyboardType="phone-pad"
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
            }}
          />
        </View>
      </View>

      {/* Organization (Optional) */}
      <View style={{ marginBottom: spacing.md }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Organization (Optional)
        </Text>
        <TextInput
          value={data.organization}
          onChangeText={(v) => setData((s) => ({ ...s, organization: v }))}
          placeholder="Your organization or group"
          style={{
            height: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.secondary,
            paddingHorizontal: 12,
          }}
        />
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
            secureTextEntry={!showPassword}
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 44,
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
            secureTextEntry={!showPassword}
            style={{
              height: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.secondary,
              paddingLeft: 36,
              paddingRight: 12,
            }}
          />
        </View>
      </View>

      {/* Experience & Motivation */}
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={[typography.label, { marginBottom: spacing.xs }]}>
          Experience & Motivation
        </Text>
        <TextInput
          value={data.experience}
          onChangeText={(v) => setData((s) => ({ ...s, experience: v }))}
          placeholder="Tell us about your experience with community work or why you want to become an agent..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{
            minHeight: 96,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.secondary,
            padding: 12,
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
        <Feather name="user-check" size={16} color={colors.primaryForeground} />
        <Text
          style={{
            color: colors.primaryForeground,
            fontWeight: "700",
            marginLeft: spacing.sm,
          }}
        >
          Submit Application
        </Text>
      </Button>

      {/* Sign in link */}
      <View style={{ alignItems: "center", marginTop: spacing.lg }}>
        <Pressable onPress={onLogin}>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            Already have an account? Sign in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
