import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:async';
import '../main.dart'; // To access BrandColors

class HardwarePairingScreen extends StatefulWidget {
  const HardwarePairingScreen({super.key});

  @override
  State<HardwarePairingScreen> createState() => _HardwarePairingScreenState();
}

class _HardwarePairingScreenState extends State<HardwarePairingScreen> {
  List<ScanResult> _scanResults = [];
  bool _isScanning = false;
  late StreamSubscription<List<ScanResult>> _scanResultsSubscription;
  late StreamSubscription<bool> _isScanningSubscription;

  @override
  void initState() {
    super.initState();
    _scanResultsSubscription = FlutterBluePlus.scanResults.listen((results) {
      if (mounted) {
        setState(() {
          _scanResults = results;
        });
      }
    });

    _isScanningSubscription = FlutterBluePlus.isScanning.listen((state) {
      if (mounted) {
        setState(() {
          _isScanning = state;
        });
      }
    });
  }

  @override
  void dispose() {
    _scanResultsSubscription.cancel();
    _isScanningSubscription.cancel();
    super.dispose();
  }

  void _startScan() async {
    // Check if Bluetooth is supported
    if (await FlutterBluePlus.isSupported == false) {
       _showMsg("Bluetooth not supported on this device.");
       return;
    }

    // Check adapter state
    if (FlutterBluePlus.adapterStateNow != BluetoothAdapterState.on) {
      _showMsg("Please turn on Bluetooth first to scan.");
      return;
    }

    try {
      await FlutterBluePlus.startScan(timeout: const Duration(seconds: 10));
    } catch (e) {
      _showMsg("Error starting scan: $e");
    }
  }

  void _showMsg(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Pair Hardware', style: TextStyle(color: BrandColors.textMain, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        leading: BackButton(color: BrandColors.primary),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Add a Safety Wearable',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: BrandColors.textMain),
            ),
            const SizedBox(height: 8),
            const Text(
              'Scan for nearby SafeNex beacons, ESP32 trackers, or smart wearables via Bluetooth.',
              style: TextStyle(color: BrandColors.textMuted),
            ),
            const SizedBox(height: 32),
            Center(
              child: _isScanning 
                ? ElevatedButton.icon(
                    onPressed: () => FlutterBluePlus.stopScan(),
                    icon: const SizedBox(
                      width: 20, height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                    ),
                    label: const Text('Scanning... (Tap to stop)'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: BrandColors.secondary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                  )
                : ElevatedButton.icon(
                    onPressed: _startScan,
                    icon: const Icon(Icons.search),
                    label: const Text('Scan for Devices'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: BrandColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    ),
                  ),
            ),
            const SizedBox(height: 32),
            const Text('AVAILABLE DEVICES', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: BrandColors.textMuted, letterSpacing: 1.2)),
            const SizedBox(height: 16),
            Expanded(
              child: _scanResults.isEmpty && !_isScanning
                  ? const Center(child: Text("No devices found.", style: TextStyle(color: BrandColors.textMuted)))
                  : ListView.builder(
                      itemCount: _scanResults.length,
                      itemBuilder: (context, index) {
                        final r = _scanResults[index];
                        final name = r.device.platformName.isNotEmpty 
                            ? r.device.platformName 
                            : (r.advertisementData.advName.isNotEmpty ? r.advertisementData.advName : "Unknown Device");
                        return _buildDeviceTile(
                          name,
                          r.device.remoteId.str,
                          r.device,
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceTile(String name, String id, BluetoothDevice device) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: BrandColors.primaryLight.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: BrandColors.primary.withOpacity(0.1)),
      ),
      child: ListTile(
        leading: const CircleAvatar(
          backgroundColor: BrandColors.primaryLight,
          child: Icon(Icons.bluetooth, color: BrandColors.primary),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('ID: $id'),
        trailing: TextButton(
          onPressed: () => _connectToDevice(device),
          child: const Text('PAIR'),
        ),
      ),
    );
  }

  Future<void> _connectToDevice(BluetoothDevice device) async {
    _showMsg('Connecting to ${device.remoteId.str}...');
    try {
      await Future.delayed(const Duration(seconds: 2));
      _showMsg('Successfully connected to ${device.remoteId.str}');
      // Hardware connection is simulated for the MVP.
    } catch (e) {
      _showMsg('Failed to connect: $e');
    }
  }
}
