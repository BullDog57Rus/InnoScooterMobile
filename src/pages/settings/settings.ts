import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  devices: any[] = [];
  statusMessage: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ngZone: NgZone,
              public ble: BLE,
              public qrScanner: QRScanner) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.scan();
  }

  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  scanQrCode() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log("Scanned QR", text);

          this.qrScanner.hide();
          scanSub.unsubscribe();
        });
      } else if (status.denied) {
        this.setStatus("Camera permission was permanently denied");
        this.qrScanner.openSettings();
      } else {
        this.setStatus("Something went wrong, please, try again later");
      }
    }).catch((e: any) => console.log('Error is', e));
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus('Error: ' + error);
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
