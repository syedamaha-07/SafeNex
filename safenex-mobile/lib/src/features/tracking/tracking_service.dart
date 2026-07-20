import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:geolocator/geolocator.dart';

class TrackingService {
  static const String _apiUrl = 'http://10.0.2.2:8000/api/v1/locations/update';
  static String? _jwtToken; // Assume this gets set post-login
  static String? _userId;   // Assume this gets set post-login
  
  Timer? _locationTimer;

  static void initialize(String token, String userId) {
    _jwtToken = token;
    _userId = userId;
  }

  void startTracking() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    // Fire every 15 seconds (battery-aware balance vs 10s)
    _locationTimer = Timer.periodic(const Duration(seconds: 15), (timer) async {
      _sendLocationUpdate();
    });
  }

  void stopTracking() {
    _locationTimer?.cancel();
  }

  Future<void> _sendLocationUpdate() async {
    if (_jwtToken == null || _userId == null) return;

    try {
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high
      );

      final response = await http.post(
        Uri.parse(_apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_jwtToken',
        },
        body: jsonEncode({
          'user_id': _userId,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      );

      if (response.statusCode != 200) {
        // Implement retry logic or local caching here in production
        print('Location update failed: ${response.body}');
      }
    } catch (e) {
      print('Location update error: $e');
    }
  }
}
