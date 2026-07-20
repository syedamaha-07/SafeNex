import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';
import 'screens/hardware_pairing.dart'; // New Phase 6 Screen
import 'screens/profile_options.dart';

void main() {
  runApp(const SafeNexApp());
}

// Global Premium Brand Colors matching the newly designed Web UI
class BrandColors {
  static const Color primary = Color(0xFF1C54A8);
  static const Color primaryLight = Color(0xFF45B3E8);
  static const Color secondary = Color(0xFFD870A0);
  static const Color success = Color(0xFF4CAF50);
  static const Color background = Color(0xFFFAFCFF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textMain = Color(0xFF0A1128);
  static const Color textMuted = Color(0xFF64748B);
}

class SafeNexApp extends StatelessWidget {
  const SafeNexApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SafeNex',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        primaryColor: BrandColors.primary,
        scaffoldBackgroundColor: BrandColors.background,
        fontFamily: 'Inter',
        colorScheme: const ColorScheme.light(
          primary: BrandColors.primary,
          secondary: BrandColors.secondary,
          surface: BrandColors.surface,
          onSurface: BrandColors.textMain,
        ),
        cardTheme: const CardThemeData(
          color: BrandColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(24)),
          ),
          elevation: 0,
        ),
      ),
      home: const SplashScreen(),
    );
  }
}

// ----------------------------------------------------------------------
// 1. Splash Screen
// ----------------------------------------------------------------------
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Simulate loading/initialization time
    Timer(const Duration(seconds: 3), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/logo.png', height: 180),
            const SizedBox(height: 24),
            const CircularProgressIndicator(color: BrandColors.primary),
          ],
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------
// 2. Login Screen
// ----------------------------------------------------------------------
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 48.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              Image.asset('assets/logo.png', height: 120),
              const SizedBox(height: 24),
              const Text(
                'Welcome Back',
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: BrandColors.textMain,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Please sign in to access your safety dashboard.',
                style: TextStyle(
                  fontSize: 16,
                  color: BrandColors.textMuted,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 48),
              
              // Custom Input Field - Email
              _buildInputField(label: 'Email', icon: Icons.email_outlined, obscure: false, placeholder: 'Enter your email'),
              const SizedBox(height: 24),
              
              // Custom Input Field - Password
              _buildInputField(label: 'Password', icon: Icons.lock_outline, obscure: true, placeholder: 'Enter your password'),
              
              const SizedBox(height: 48),
              
              // Gradient CTA Button
              Container(
                width: double.infinity,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [BrandColors.primary, BrandColors.primaryLight],
                  ),
                  borderRadius: BorderRadius.circular(100),
                  boxShadow: [
                    BoxShadow(
                      color: BrandColors.primaryLight.withOpacity(0.4),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pushReplacement(
                      MaterialPageRoute(builder: (_) => const DashboardScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(100),
                    ),
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({required String label, required IconData icon, required bool obscure, required String placeholder}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w600, color: BrandColors.textMain),
        ),
        const SizedBox(height: 8),
        TextField(
          obscureText: obscure,
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: BrandColors.textMuted),
            fillColor: Colors.white,
            filled: true,
            hintText: placeholder,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: BrandColors.primary.withOpacity(0.1)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: BrandColors.primary.withOpacity(0.1)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: BrandColors.primary, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}

// ----------------------------------------------------------------------
// 3. Interactive Dashboard Screen
// ----------------------------------------------------------------------
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isTracking = false;
  bool _isWalkMode = false;
  Timer? _trackingTimer;
  
  // Hardcoded for testing since auth is unlinked
  final String _testUserId = 'b9c3f4a1-8d2e-4c7b-9e1f-a5d6c8b2e3f4';
  
  // Depending on emulators, you may need to use 10.0.2.2 instead of 127.0.0.1 
  // We'll use 10.0.2.2 which is the Android emulator's alias to localhost
  final String _baseUrl = 'http://10.0.2.2:8000/api/v1';

  @override
  void dispose() {
    _trackingTimer?.cancel();
    super.dispose();
  }

  Future<void> _triggerSOS() async {
    _showActionMsg('Sending SOS alert...');
    try {
      final position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
      
      final response = await http.post(
        Uri.parse('$_baseUrl/sos/trigger'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': _testUserId,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': DateTime.now().toUtc().toIso8601String(),
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
         _showActionMsg('Emergency SOS sent! Your guardians are notified.');
      } else {
         _showActionMsg('Failed to send SOS. Please check your connection.');
      }
    } catch (e) {
      _showActionMsg('Connection Error: Could not reach help.');
    }
  }

  Future<void> _sendLocation() async {
    try {
      // Very basic permission check for demo
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }

      final position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
      
      final response = await http.post(
        Uri.parse('$_baseUrl/locations/update'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': _testUserId,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': DateTime.now().toUtc().toIso8601String(),
        }),
      );
      
      if (response.statusCode == 200) {
        // Silently successful
        print("Location update success");
      }
    } catch (e) {
      print("Tracking Error: $e");
    }
  }

  void _toggleTracking() {
    setState(() {
      _isTracking = !_isTracking;
      if (_isTracking) {
         _showActionMsg('Tracking engaged. Staming location.');
         _sendLocation();
         _startTimer();
      } else {
         _showActionMsg('Tracking stopped.');
         _isWalkMode = false;
         _trackingTimer?.cancel();
      }
    });
  }

  void _toggleWalkMode() {
    if (!_isTracking) {
       _showActionMsg('Please start tracking first.');
       return;
    }
    setState(() {
      _isWalkMode = !_isWalkMode;
      _trackingTimer?.cancel(); // restart timer with new interval
      _startTimer();
      if (_isWalkMode) {
        _showActionMsg('Walk-with-Me enabled: Higher update frequency.');
      } else {
        _showActionMsg('Standard frequency restored.');
      }
    });
  }

  void _startTimer() {
    int interval = _isWalkMode ? 5 : 15;
    _trackingTimer = Timer.periodic(Duration(seconds: interval), (timer) {
      _sendLocation();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Image.asset('assets/logo.png', height: 48),
                    ],
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ProfileScreen()),
                      );
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: BrandColors.primary.withOpacity(0.1)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: const Icon(Icons.person_outline, color: BrandColors.textMain),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // Intelligence Glass Card Equivalent
              Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [BrandColors.primary, BrandColors.primaryLight],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: BrandColors.primaryLight.withOpacity(0.3),
                      blurRadius: 30,
                      offset: const Offset(0, 15),
                    )
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 12,
                          height: 12,
                          decoration: const BoxDecoration(
                            color: BrandColors.success,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(color: BrandColors.success, blurRadius: 10)
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'SYSTEM ARMED',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Live Protection',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Monitoring your movement for unusual activity. Stay safe.',
                      style: TextStyle(color: Colors.white70, height: 1.5, fontSize: 13),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              
              const Text(
                'Safety Controls',
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: BrandColors.textMain,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 16),
              
              // Interactive Grid
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  children: [
                    SafetyCard(
                      title: _isTracking ? 'Stop Tracking' : 'Start Tracking',
                      icon: _isTracking ? Icons.location_off : Icons.location_on,
                      status: _isTracking ? 'Active' : 'Inactive',
                      isActive: _isTracking,
                      onTap: _toggleTracking,
                    ),
                    SafetyCard(
                      title: 'Wearable Sync',
                      icon: Icons.watch_outlined,
                      status: 'Hardware',
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const HardwarePairingScreen()),
                      ),
                    ),
                    SafetyCard(
                      title: 'Safety Timer',
                      icon: Icons.timer_outlined,
                      status: 'Set Timer',
                      onTap: () => _showActionMsg('Safety timer set for 30 minutes.'),
                    ),
                    SafetyCard(
                      title: 'SOS Alert',
                      icon: Icons.emergency,
                      isWarning: true,
                      onTap: _triggerSOS,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showActionMsg(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontWeight: FontWeight.bold)),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        backgroundColor: BrandColors.textMain,
      ),
    );
  }
}

// ----------------------------------------------------------------------
// 4. Profile Screen
// ----------------------------------------------------------------------
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: BrandColors.textMain,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const Center(
              child: CircleAvatar(
                radius: 60,
                backgroundColor: BrandColors.primaryLight,
                child: Icon(Icons.person, size: 60, color: Colors.white),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Aqsa Khan',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: BrandColors.textMain),
            ),
            const Text(
              'aqsa@example.com',
              style: TextStyle(fontSize: 16, color: BrandColors.textMuted),
            ),
            const SizedBox(height: 48),
            _buildProfileOption(icon: Icons.settings, title: 'Settings', destination: const SettingsScreen(), context: context),
            _buildProfileOption(icon: Icons.security, title: 'Privacy', destination: const PrivacyScreen(), context: context),
            _buildProfileOption(icon: Icons.help_outline, title: 'Help & Support', destination: const HelpScreen(), context: context),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () {
                  // Logout and go back to LoginScreen
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade50,
                  foregroundColor: Colors.red,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('Logout', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileOption({required IconData icon, required String title, Widget? destination, required BuildContext context}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            if (destination != null) {
              Navigator.push(context, MaterialPageRoute(builder: (_) => destination));
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('$title section coming soon.', style: const TextStyle(fontWeight: FontWeight.bold)),
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  backgroundColor: BrandColors.textMain,
                  duration: const Duration(seconds: 2),
                ),
              );
            }
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: BrandColors.primary.withOpacity(0.05)),
            ),
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
        ),
      ),
    );
  }
}

class SafetyCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final String? status;
  final bool isWarning;
  final bool isActive;
  final VoidCallback onTap;

  const SafetyCard({
    super.key,
    required this.title,
    required this.icon,
    this.status,
    this.isWarning = false,
    this.isActive = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isActive ? BrandColors.primary.withOpacity(0.05) : Colors.white,
      borderRadius: BorderRadius.circular(24),
      elevation: isActive ? 0 : 5,
      shadowColor: Colors.black.withOpacity(0.05),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        splashColor: (isWarning ? BrandColors.secondary : BrandColors.primaryLight).withOpacity(0.1),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isActive ? BrandColors.primary : BrandColors.primary.withOpacity(0.05),
              width: isActive ? 2 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: (isWarning ? BrandColors.secondary : (isActive ? BrandColors.primary : BrandColors.primaryLight)).withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      icon,
                      color: isWarning ? BrandColors.secondary : (isActive ? BrandColors.primary : BrandColors.primary),
                      size: 24,
                    ),
                  ),
                  if (status != null)
                    Text(
                      status!,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isActive ? BrandColors.primary : BrandColors.textMuted,
                      ),
                    ),
                ],
              ),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: BrandColors.textMain,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
