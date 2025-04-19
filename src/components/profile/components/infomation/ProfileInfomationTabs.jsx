import { Tabs, Button, TextInput, Textarea, Text, Alert } from "@mantine/core";
import {
  IconUser,
  IconLock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import classes from "./ProfileInfomationTabs.module.css";
import { useState, useEffect, useRef } from "react";
import ReusableImageUploader from "../../../../services/ReusableImageUploader";
import { updateProfile, changePassword } from "../../../../util/http";
import { removeEmptyFields } from "../../../common/removeEmptyFields";
import { notifications } from "@mantine/notifications";
import PasswordStrengthChecker from "../../../common/PasswordStrengthChecker";
import useAddressSuggestions from "../../../common/customHook/useAddressSuggestions";

function ProfileTabs({ profileData: initialProfileData }) {
  // Profile tab states
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState({
    type: null,
    message: "",
  });
  const {
    query,
    setQuery,
    suggestions,
    error,
    showSuggestions,
    setShowSuggestions,
  } = useAddressSuggestions(); // API key

  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecuritySubmitting, setIsSecuritySubmitting] = useState(false);
  const [securitySaveStatus, setSecuritySaveStatus] = useState({
    type: null,
    message: "",
  });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Handle input changes for profile tab
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileSaveStatus({ type: null, message: "" });
  };

  // Handle image upload
  const handleImageUpload = (uploadedFiles) => {
    setProfileData((prev) => ({
      ...prev,
      profileImage: uploadedFiles[0]?.url || null,
    }));
  };

  // Save profile changes
  const handleSave = async () => {
    setIsSubmitting(true);
    setProfileSaveStatus({ type: null, message: "" });

    try {
      const requestBody = {
        avatarUrl: profileData.profileImage || "",
        email: profileData.email,
        address: profileData.address,
        phoneNumber: profileData.phone,
      };
      const cleanedData = removeEmptyFields(requestBody);

      const response = await updateProfile(cleanedData);

      setProfileSaveStatus({
        type: "success",
        message: response.message || "Profile updated successfully!",
      });

      notifications.show({
        title: "Success",
        message: "Profile updated successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);

      setProfileSaveStatus({
        type: "error",
        message: error.message || "Failed to update profile. Please try again.",
      });

      notifications.show({
        title: "Error",
        message: error.message || "Failed to update profile. Please try again.",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setProfileData((prev) => ({ ...prev, address: val }));
    setProfileSaveStatus({ type: null, message: "" });
  };

  const handleAddressSelect = (val) => {
    setQuery(val);
    setProfileData((prev) => ({ ...prev, address: val }));
    setShowSuggestions(false);
    setProfileSaveStatus({ type: null, message: "" });
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      notifications.show({
        title: "Error",
        message: "Passwords do not match",
        color: "red",
      });
      return;
    }

    setIsSecuritySubmitting(true);
    setSecuritySaveStatus({ type: null, message: "" });

    try {
      const response = await changePassword({
        password: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      setSecuritySaveStatus({
        type: "success",
        message: response.message || "Password changed successfully!",
      });

      notifications.show({
        title: "Success",
        message: "Password changed successfully!",
        color: "green",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessages = [];

        Object.entries(error.response.data).forEach(([field, message]) => {
          errorMessages.push(`${field}: ${message}`);
          notifications.show({
            title: `${field} Error`,
            message: message,
            color: "red",
          });
        });

        setSecuritySaveStatus({
          type: "error",
          message: errorMessages.join(", ") || "Failed to change password.",
        });
      } else {
        setSecuritySaveStatus({
          type: "error",
          message: "An unexpected error occurred. Please try again later.",
        });

        notifications.show({
          title: "Error",
          message: "An unexpected error occurred. Please try again later.",
          color: "red",
        });
      }
    } finally {
      setIsSecuritySubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Account</h1>
      </div>

      <Tabs variant="unstyled" defaultValue="profile" classNames={classes}>
        <Tabs.List grow>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile Information
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            Security
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile" pt="xs">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Username"
                name="username"
                value={profileData.username}
                disabled
                placeholder="Your username"
              />
              <TextInput
                label="Phone Number"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                type="text"
                inputMode="numeric"
                placeholder="Enter your phone number"
              />
            </div>

            <TextInput
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />

            <Textarea
              label="Description"
              name="description"
              value={profileData.description}
              onChange={handleInputChange}
              placeholder="Tell us a little bit more about yourself"
              minRows={3}
              maxRows={5}
            />

            <div>
              <TextInput
                label="Address"
                name="address"
                value={query}
                onChange={handleAddressChange}
                placeholder="Start typing your address..."
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="border rounded shadow-md mt-1 ">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.value}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleAddressSelect(suggestion.value)}
                    >
                      {suggestion.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image
              </label>
              <ReusableImageUploader
                onUpload={handleImageUpload}
                multiple={false}
              />
            </div>

            {profileSaveStatus.type && (
              <Alert
                icon={
                  profileSaveStatus.type === "success" ? (
                    <IconCheck size={16} />
                  ) : (
                    <IconAlertCircle size={16} />
                  )
                }
                title={
                  profileSaveStatus.type === "success" ? "Success!" : "Error"
                }
                color={profileSaveStatus.type === "success" ? "green" : "red"}
                withCloseButton
                onClose={() =>
                  setProfileSaveStatus({ type: null, message: "" })
                }
              >
                {profileSaveStatus.message}
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Tabs.Panel>

        {/* Security Tab */}
        <Tabs.Panel value="security" pt="xs">
          <div className="p-6 max-w-lg mx-auto  rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Security Settings</h2>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <div>
                <TextInput
                  label="Password"
                  type="password"
                  placeholder="Enter your existing password"
                  className="w-full"
                  value={currentPassword}
                  onChange={(e) => {
                    setSecuritySaveStatus({ type: null, message: "" });
                    setCurrentPassword(e.target.value);
                  }}
                />
              </div>

              <div className="relative">
                <TextInput
                  label="New Password"
                  type="password"
                  placeholder="Your new password"
                  className="w-full"
                  description="Password must include at least one letter, number and special character"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setShowPasswordStrength(true);
                    setSecuritySaveStatus({ type: null, message: "" });
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowPasswordStrength(false), 150)
                  }
                  onFocus={() => setShowPasswordStrength(true)}
                />
                {showPasswordStrength && (
                  <PasswordStrengthChecker password={newPassword} />
                )}
              </div>

              <div>
                <TextInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setSecuritySaveStatus({ type: null, message: "" });
                  }}
                  error={
                    confirmPassword && newPassword !== confirmPassword
                      ? "Passwords do not match"
                      : null
                  }
                />
              </div>

              {securitySaveStatus.type && (
                <Alert
                  icon={
                    securitySaveStatus.type === "success" ? (
                      <IconCheck size={16} />
                    ) : (
                      <IconAlertCircle size={16} />
                    )
                  }
                  title={
                    securitySaveStatus.type === "success" ? "Success!" : "Error"
                  }
                  color={
                    securitySaveStatus.type === "success" ? "green" : "red"
                  }
                  withCloseButton
                  onClose={() =>
                    setSecuritySaveStatus({ type: null, message: "" })
                  }
                >
                  {securitySaveStatus.message}
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  type="submit"
                  disabled={isSecuritySubmitting}
                  loading={isSecuritySubmitting}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default ProfileTabs;
