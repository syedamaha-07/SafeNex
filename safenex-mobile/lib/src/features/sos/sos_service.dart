import 'dart:convert';
import 'package:http/http.dart' as http;

class SOSService {
  static const String _apiUrl = 'http://10.0.2.2:8000/api/v1/sos/trigger';
  
  static Future<bool> triggerSOS(String token, String userId) async {
    try {
      final response = await http.post(
        Uri.parse(_apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'user_id': userId,
          'status': 'active', // required for payload, though backend usually overrides
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('SOS Trigger failed: ${response.statusCode} - ${response.body}');
        return false;
      }
    } catch (e) {
      print('SOS Service Error: $e');
      return false;
    }
  }
}
