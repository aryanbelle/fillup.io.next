"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  HiOutlineUser, 
  HiOutlineLockClosed, 
  HiOutlineBell, 
  HiOutlineGlobe,
  HiOutlineCheck
} from "react-icons/hi";

const SettingsPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    formSubmissions: true,
    marketing: false,
    updates: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    // Simulate saving
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Settings</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition ${
                  activeTab === "profile" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HiOutlineUser className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition ${
                  activeTab === "security" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HiOutlineLockClosed className="h-5 w-5" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition ${
                  activeTab === "notifications" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HiOutlineBell className="h-5 w-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left transition ${
                  activeTab === "preferences" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HiOutlineGlobe className="h-5 w-5" />
                <span>Preferences</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <HiOutlineUser className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </h4>
                      <p className="text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue={user?.firstName || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue={user?.lastName || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.emailAddresses[0]?.emailAddress || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user?.phoneNumbers[0]?.phoneNumber || ""}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      {saveSuccess && <HiOutlineCheck className="h-5 w-5" />}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Enable two-factor authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      {saveSuccess && <HiOutlineCheck className="h-5 w-5" />}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Form Submissions</p>
                      <p className="text-sm text-gray-500">Get notified when someone submits a form</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.formSubmissions}
                        onChange={() => handleNotificationChange('formSubmissions')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Product Updates</p>
                      <p className="text-sm text-gray-500">Get notified about new features and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.updates}
                        onChange={() => handleNotificationChange('updates')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      {saveSuccess && <HiOutlineCheck className="h-5 w-5" />}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Language</h4>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Time Zone</h4>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="utc">UTC (Coordinated Universal Time)</option>
                      <option value="est">EST (Eastern Standard Time)</option>
                      <option value="cst">CST (Central Standard Time)</option>
                      <option value="pst">PST (Pacific Standard Time)</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-blue-500 p-4 rounded-lg text-center cursor-pointer bg-white">
                        <div className="h-12 bg-white border border-gray-200 rounded mb-2"></div>
                        <span className="text-sm font-medium">Light</span>
                      </div>
                      <div className="border border-gray-200 p-4 rounded-lg text-center cursor-pointer">
                        <div className="h-12 bg-gray-800 rounded mb-2"></div>
                        <span className="text-sm font-medium">Dark</span>
                      </div>
                      <div className="border border-gray-200 p-4 rounded-lg text-center cursor-pointer">
                        <div className="h-12 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                        <span className="text-sm font-medium">System</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      {saveSuccess && <HiOutlineCheck className="h-5 w-5" />}
                      {saveSuccess ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 