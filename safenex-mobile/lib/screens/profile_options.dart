import 'package:flutter/material.dart';
import '../main.dart'; // To access BrandColors

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: BrandColors.textMain,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24.0),
        children: [
          _buildToggle(Icons.notifications_active, 'Push Notifications', true),
          _buildToggle(Icons.location_on, 'High Accuracy Location', true),
          _buildToggle(Icons.dark_mode, 'Dark Mode', false),
          const SizedBox(height: 24),
          const Text('Account', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: BrandColors.textMain)),
          const SizedBox(height: 16),
          _buildLinkOption(Icons.edit, 'Edit Profile'),
          _buildLinkOption(Icons.lock, 'Change Password'),
        ],
      ),
    );
  }

  Widget _buildToggle(IconData icon, String title, bool initialValue) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: SwitchListTile(
          value: initialValue,
          onChanged: (val) {},
          title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          secondary: Icon(icon, color: BrandColors.primary),
          activeColor: BrandColors.primary,
        ),
      ),
    );
  }

  Widget _buildLinkOption(IconData icon, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Row(
          children: [
            Icon(icon, color: BrandColors.primary),
            const SizedBox(width: 16),
            Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const Spacer(),
            const Icon(Icons.chevron_right, color: BrandColors.textMuted),
          ],
        ),
      ),
    );
  }
}

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: BrandColors.textMain,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24.0),
        children: [
          const Text('Data Sharing', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: BrandColors.textMain)),
          const SizedBox(height: 16),
          _buildInfoCard(Icons.share, 'Share data with Guardian', 'Only your assigned guardian can view your live location and SOS alerts. SafeNex never sells your data.'),
          const SizedBox(height: 24),
          const Text('Permissions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: BrandColors.textMain)),
          const SizedBox(height: 16),
          _buildInfoCard(Icons.my_location, 'Location Access', 'Allowed "Always" to enable background tracking and geofencing.'),
          _buildInfoCard(Icons.bluetooth, 'Bluetooth Access', 'Allowed for hardware pairing (ESP32 / Wearables).'),
        ],
      ),
    );
  }

  Widget _buildInfoCard(IconData icon, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: BrandColors.primary),
                const SizedBox(width: 12),
                Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
              ],
            ),
            const SizedBox(height: 12),
            Text(subtitle, style: const TextStyle(color: BrandColors.textMuted, height: 1.4)),
          ],
        ),
      ),
    );
  }
}

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: BrandColors.textMain,
      ),
      body: ListView(
        padding: const EdgeInsets.all(24.0),
        children: [
          _buildFaqCard('How do I trigger an SOS?', 'Press the red "SOS Alert" button from the dashboard. This immediately alerts your guardian with your exact location.'),
          _buildFaqCard('Can I add a wearable?', 'Yes, go to Dashboard > Wearable Sync to pair a BLE device like an ESP32 or smartwatch.'),
          _buildFaqCard('Why is my location not updating?', 'Ensure that SafeNex has "Always Allow" location permission in your device settings.'),
          const SizedBox(height: 32),
          SizedBox(
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.email_outlined),
              label: const Text('Contact Support', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: BrandColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildFaqCard(String question, String answer) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: BrandColors.primary.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(question, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
            const SizedBox(height: 8),
            Text(answer, style: const TextStyle(color: BrandColors.textMuted, height: 1.4)),
          ],
        ),
      ),
    );
  }
}
