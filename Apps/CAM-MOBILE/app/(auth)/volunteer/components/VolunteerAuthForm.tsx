import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../../../src/styles/colors";
import { spacing } from "../../../../src/styles/spacing";
import { typography } from "../../../../src/styles/typography";
import { Button } from "../../../../src/components/ui/Button";

type Props = {
  onSubmit: (data: { email: string; password: string }) => void;
  onRegister: () => void;
};

export default function VolunteerAuthForm({ onSubmit, onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await Promise.resolve();
      onSubmit({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: spacing.lg }}>
      {/* Icon + Title */}
      <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#ffedd5", // orange-100
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.md,
          }}
        >
          <Feather name="users" size={40} color="#ea580c" />
        </View>
        <Text style={[typography.h2, { marginBottom: spacing.xs }]}>
          Welcome Back, Volunteer
        </Text>
        <Text style={{ color: colors.muted }}>Sign in to continue helping</Text>
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
            value={email}
            onChangeText={setEmail}
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

      {/* Password */}
      <View style={{ marginBottom: spacing.lg }}>
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
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
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
        <Feather name="log-in" size={16} color={colors.primaryForeground} />
        <Text
          style={{
            color: colors.primaryForeground,
            fontWeight: "700",
            marginLeft: spacing.sm,
          }}
        >
          Sign In as Volunteer
        </Text>
      </Button>

      {/* Forgot password */}
      <View style={{ alignItems: "center", marginTop: spacing.lg }}>
        <Pressable onPress={() => {}}>
          <Text style={{ fontSize: 14, fontWeight: "600" }}>
            Forgot Password?
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.border,
          marginTop: spacing.xl,
          marginBottom: spacing.lg,
        }}
      />

      {/* Create account */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: colors.muted, marginBottom: spacing.sm }}>
          New to volunteering?
        </Text>
        <Button
          variant="outline"
          onPress={onRegister}
          style={{
            height: 48,
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
          textStyle={{ fontWeight: "700" }}
        >
          <Feather name="heart" size={16} color={colors.cardForeground} />
          <Text style={{ marginLeft: spacing.sm, fontWeight: "700" }}>
            Join as Volunteer
          </Text>
        </Button>
      </View>
    </View>
  );
}
